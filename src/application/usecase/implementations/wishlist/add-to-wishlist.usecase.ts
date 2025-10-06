import { inject, injectable } from "tsyringe";
import { IAddToWishListUsecase } from "../../interfaces/wishlist/add-to-wishlist-usecase.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IWishListRepository } from "../../../../domain/repositoryInterfaces/wishlist/wishlist-repository.interface";

@injectable()
export class AddToWishListUsecase implements IAddToWishListUsecase {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,

    @inject("IWishListRepository")
    private _wishlistRepository: IWishListRepository
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
      await this._wishlistRepository.save({ userId, packages: [] });
    }

    await this._wishlistRepository.addToWishList(userId, packageId);
  }
}
