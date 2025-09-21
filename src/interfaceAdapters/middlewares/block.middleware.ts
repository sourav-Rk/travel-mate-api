import { Response, NextFunction, RequestHandler } from "express";
import { inject, injectable } from "tsyringe";

import { IBlockedMiddleware } from "../../entities/middleWareInterfaces/blocked-middleware.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IBlackListTokenUsecase } from "../../entities/useCaseInterfaces/auth/blacklist-token-usecase.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { clearCookie } from "../../shared/utils/cookieHelper";

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

        const accessTokenName = `${role}_access_token`;
        const refreshTokenName = `${role}_refresh_token`;
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
