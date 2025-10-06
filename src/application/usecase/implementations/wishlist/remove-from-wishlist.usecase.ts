import { inject, injectable } from "tsyringe";
import { IRemoveFromWishlistUsecase } from "../../interfaces/wishlist/remove-from-wishlist-usecase.interface";
import { IWishListRepository } from "../../../../domain/repositoryInterfaces/wishlist/wishlist-repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";

@injectable()
export class RemoveFromWishListUsecase implements IRemoveFromWishlistUsecase {
  constructor(
    @inject("IWishListRepository")
    private _wishlistRepository: IWishListRepository,

    @inject("IClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  async execute(userId: string, packageId: string): Promise<void> {
    if (!userId || !packageId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const user = await this._clientRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const wishlist = await this._wishlistRepository.findByUserId(userId);

    if (!wishlist) {
      throw new NotFoundError(ERROR_MESSAGE.WISHLIST_NOT_FOUND);
    }

    await this._wishlistRepository.removeFromWishlist(userId, packageId);
  }
}
