import { inject, injectable } from "tsyringe";
import { IWishlistController } from "../../interfaces/controllers/wishlist/wishlist-controller.interface";
import { Request, Response } from "express";
import { IGetWishlistUsecase } from "../../../application/usecase/interfaces/wishlist/getWishlist-usecase.interface";
import { IAddToWishListUsecase } from "../../../application/usecase/interfaces/wishlist/add-to-wishlist-usecase.interface";
import { IRemoveFromWishlistUsecase } from "../../../application/usecase/interfaces/wishlist/remove-from-wishlist-usecase.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";

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
    res.status(HTTP_STATUS.OK).json({ success: true, data });
  }

  async addToWishlist(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { packageId } = req.body;
    await this._addToWishlistUsecase.execute(userId, packageId);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGE.ADDED_TO_WISHLIST });
  }

  async removeFromWishlist(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { packageId } = req.body;
    await this._removeFromWishlistUsecase.execute(userId, packageId);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGE.REMOVED_FROM_WISHLIST });
  }
}
