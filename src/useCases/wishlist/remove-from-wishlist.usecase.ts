import { inject, injectable } from "tsyringe";
import { IRemoveFromWishlistUsecase } from "../../entities/useCaseInterfaces/wishlist/remove-from-wishlist-usecase.interface";
import { IWishListRepository } from "../../entities/repositoryInterfaces/wishlist/wishlist-repository.interface";
import { ValidationError } from "../../shared/utils/error/validationError";
import { ERROR_MESSAGE } from "../../shared/constants";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { NotFoundError } from "../../shared/utils/error/notFoundError";

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
