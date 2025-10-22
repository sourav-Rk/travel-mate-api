import { Socket } from "socket.io";
import { ITokenService } from "../../domain/service-interfaces/token-service.interface";
import { CustomError } from "../../domain/errors/customError";
import {
  COOKIES_NAMES,
  ERROR_MESSAGE,
  TRole,
} from "../../shared/constants";
import { parse } from "cookie";

export const socketAuthMiddleware =
  (tokenService: ITokenService, allowedRoles: string[]) =>
  (socket: Socket, next: (err?: any) => void) => {
    try {

      const rawCookie = socket.handshake.headers.cookie;

      if (!rawCookie) {
        console.log("No cookies found");
        throw new CustomError(401,ERROR_MESSAGE.COOKIE_NOT_FOUND);
      }

      const cookies = parse(rawCookie);

      const token = cookies[COOKIES_NAMES.REFRESH_TOKEN];

      if (!token) {
        console.log(" No refresh token in cookies");
        throw new CustomError(401,ERROR_MESSAGE.TOKEN_MISSING);
      }
      const payload = tokenService.verifyRefreshToken(token);

      if (!payload || !payload.id || !payload.role || !payload.email) {
        throw new Error(ERROR_MESSAGE.INVALID_TOKEN);
      }

      const userRole = payload.role as TRole;
      if (!allowedRoles.includes(userRole)) {
        console.log(`Role not allowed: ${userRole}, allowed: ${allowedRoles}`);
        throw new Error(ERROR_MESSAGE.FORBIDDEN_ROLE);
      }

      socket.data.userId = payload.id;
      socket.data.role = payload.role;
      socket.data.email = payload.email;

      next();
    } catch (err) {
      console.log("Socket auth error:", err);
      next(err);
    }
  };
