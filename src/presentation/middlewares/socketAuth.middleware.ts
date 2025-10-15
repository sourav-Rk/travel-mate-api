import { Socket } from "socket.io";
import { ITokenService } from "../../domain/service-interfaces/token-service.interface";
import { CustomError } from "../../domain/errors/customError";
import {
  COOKIES_NAMES,
  ERROR_MESSAGE,
} from "../../shared/constants";
import { parse } from "cookie";

export const socketAuthMiddleware =
  (tokenService: ITokenService, allowedRoles: string[]) =>
  (socket: Socket, next: (err?: any) => void) => {
    try {
      console.log("Socket Auth Middleware triggered");

      const rawCookie = socket.handshake.headers.cookie;

      if (!rawCookie) {
        console.log("No cookies found");
        throw new CustomError(401, "No cookie found");
      }

      const cookies = parse(rawCookie);

      const token = cookies[COOKIES_NAMES.REFRESH_TOKEN];

      if (!token) {
        console.log(" No refresh token in cookies");
        throw new CustomError(401, "No token provided");
      }
      const payload = tokenService.verifyRefreshToken(token);

      if (!payload || !payload.id || !payload.role || !payload.email) {
        throw new Error(ERROR_MESSAGE.INVALID_TOKEN);
      }

      const userRole = payload.role as "client" | "guide" | "vendor";
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
