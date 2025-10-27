import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IAddToWishListUsecase } from "../../../application/usecase/interfaces/wishlist/add-to-wishlist-usecase.interface";
import { IGetWishlistUsecase } from "../../../application/usecase/interfaces/wishlist/getWishlist-usecase.interface";
import { IRemoveFromWishlistUsecase } from "../../../application/usecase/interfaces/wishlist/remove-from-wishlist-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IWishlistController } from "../../interfaces/controllers/wishlist/wishlist-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class WishlistController implements IWishlistController {
  constructor(
    @inject("IGetWishlistUsecase")
    private _getWishlistUsecase: IGetWishlistUsecase,

    @inject("IAddToWishListUsecase")
    private _addToWishlistUsecase: IAddToWishListUsecase,

    @inject("IRemoveFromWishlistUsecase")
    private _removeFromWishlistUsecase: IRemoveFromWishlistUsecase
  ) {}

  async getWishlist(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const data = await this._getWishlistUsecase.execute(userId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      data
    );
  }

  async addToWishlist(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { packageId } = req.body;
    await this._addToWishlistUsecase.execute(userId, packageId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.ADDED_TO_WISHLIST
    );
  }

  async removeFromWishlist(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { packageId } = req.body;
    await this._removeFromWishlistUsecase.execute(userId, packageId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.REMOVED_FROM_WISHLIST
    );
  }
}
