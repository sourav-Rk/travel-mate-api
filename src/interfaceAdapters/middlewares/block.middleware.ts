import { Response, NextFunction } from "express";
import { CustomRequest } from "./auth.middleware";
import { clearCookie } from "../../shared/utils/cookieHelper";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IBlackListTokenUsecase } from "../../entities/useCaseInterfaces/auth/blacklist-token-usecase.interface";
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { IBlockedMiddleware } from "../../entities/middleWareInterfaces/blocked-middleware.interface";

@injectable()
export class BlockedMiddleware implements IBlockedMiddleware {
  constructor(
    @inject("IClientRepository")
    private readonly clientRepository: IClientRepository,
    @inject("IVendorRepository")
    private readonly vendorRepository: IVendorRepository,
    @inject("IBlackListTokenUsecase")
    private readonly blackListTokenUseCase: IBlackListTokenUsecase,

  ) {}

  checkBlockedStatus = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTH_NO_USER_FOUND,
        });
        return;
      }

      const { id, role } = req.user;
      let blocked ;

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
        } else {
          res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: ERROR_MESSAGE.INVALID_ROLE,
          });
          return;
        }

    
      if(blocked) {
        await this.blackListTokenUseCase.execute(req.user.access_token);

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
