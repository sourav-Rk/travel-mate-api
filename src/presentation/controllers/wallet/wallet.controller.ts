import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGetWalletByIdUsecase } from "../../../application/usecase/interfaces/wallet/get-walletById-usecase.interface";
import { IGetWalletByUserIdUsecase } from "../../../application/usecase/interfaces/wallet/get-walletByUserId-usecase.interface";
import { IGetWalletTransactionsUsecase } from "../../../application/usecase/interfaces/wallet/getWalletTransactions-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import {
  HTTP_STATUS,
  SUCCESS_MESSAGE,
  TRANSACTION_TYPE_FILTER,
  TRole,
} from "../../../shared/constants";
import { IWalletController } from "../../interfaces/controllers/wallet/wallet-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class WalletController implements IWalletController {
  constructor(
    @inject("IGetWalletTransactionsUsecase")
    private _getWalletTransactionsUsecase: IGetWalletTransactionsUsecase,

    @inject("IGetWalletByIdUsecase")
    private _getWalletByIdUsecase: IGetWalletByIdUsecase,

    @inject("IGetWalletByUserIdUsecase")
    private _getWalletByUserIdUsecase: IGetWalletByUserIdUsecase
  ) {}

  async getWalletById(req: Request, res: Response): Promise<void> {
    const { walletId } = req.params;
    const data = await this._getWalletByIdUsecase.execute(walletId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      data
    );
  }

  async getWalletByUserId(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const role = (req as CustomRequest).user.role;
    const data = await this._getWalletByUserIdUsecase.execute(
      userId,
      role as TRole
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      data
    );
  }

  async getWalletTransactions(req: Request, res: Response): Promise<void> {
    const { walletId, page, limit, type, searchTerm, sortby } = req.query;
    const { data, total } = await this._getWalletTransactionsUsecase.execute(
      String(walletId),
      Number(page),
      Number(limit),
      type as TRANSACTION_TYPE_FILTER,
      String(searchTerm),
      sortby as "newest" | "oldest"
    );

    ResponseHelper.paginated(
      res,
      data,
      total,
      Number(page),
      SUCCESS_MESSAGE.DETAILS_FETCHED
    );
  }
}
