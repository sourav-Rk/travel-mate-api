import { Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

import { IBlackListTokenUsecase } from "../../application/usecase/interfaces/auth/blacklist-token-usecase.interface";
import { IClientRepository } from "../../domain/repositoryInterfaces/client/client.repository.interface";
import { IVendorRepository } from "../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import {
  COOKIES_NAMES,
  ERROR_MESSAGE,
  HTTP_STATUS,
} from "../../shared/constants";
import { clearCookie } from "../../shared/utils/cookieHelper";
import { IBlockedMiddleware } from "../interfaces/middleware/blocked-middleware.interface";

import { CustomRequest } from "./auth.middleware";

@injectable()
export class BlockedMiddleware implements IBlockedMiddleware {
  constructor(
    @inject("IClientRepository")
    private readonly clientRepository: IClientRepository,
    @inject("IVendorRepository")
    private readonly vendorRepository: IVendorRepository,
    @inject("IBlackListTokenUsecase")
    private readonly blackListTokenUseCase: IBlackListTokenUsecase
  ) {}

  checkBlockedStatus = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const customReq = req as CustomRequest;

      if (!customReq.user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTH_NO_USER_FOUND,
        });
        return;
      }

      const { id, role } = customReq.user;
      let blocked;

      if (role === "client") {
        const client = await this.clientRepository.findById(id);
        if (!client) {
          res.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            message: ERROR_MESSAGE.USER_NOT_FOUND,
          });
          return;
        }
        blocked = client.isBlocked;
      } else if (role === "vendor") {
        const vendor = await this.vendorRepository.findById(id);
        if (!vendor) {
          res.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            message: ERROR_MESSAGE.USER_NOT_FOUND,
          });
          return;
        }
        blocked = vendor.isBlocked;
      } else if (role === "admin" || role === "guide") {
        blocked = false;
      } else {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.INVALID_ROLE,
        });
        return;
      }

      if (blocked) {
        await this.blackListTokenUseCase.execute(customReq.user.accessToken);

        const accessTokenName = COOKIES_NAMES.ACCESS_TOKEN;
        const refreshTokenName = COOKIES_NAMES.REFRESH_TOKEN;
        clearCookie(res, accessTokenName, refreshTokenName);
        res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: ERROR_MESSAGE.BLOCKED,
        });
        return;
      }

      next();
    } catch (error) {
      console.error("Error in blocked status middleware:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGE.SERVER_ERROR,
      });
      return;
    }
  };
}
