import { inject, injectable } from "tsyringe";
import { IGetWishlistUsecase } from "../../interfaces/wishlist/getWishlist-usecase.interface";
import { IWishListRepository } from "../../../../domain/repositoryInterfaces/wishlist/wishlist-repository.interface";
import { WishlistDto } from "../../../dto/response/wishlistDto";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
@injectable()
export class GetWishlistUsecase implements IGetWishlistUsecase {
  constructor(
    @inject("IWishListRepository")
    private _wishlistRepository: IWishListRepository,

    @inject("IClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  async execute(userId: string): Promise<WishlistDto> {
    if (!userId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const user = await this._clientRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const wishlist =
      await this._wishlistRepository.getWishlistWithPackageDetails(userId);

    if (!wishlist) {
      throw new NotFoundError(ERROR_MESSAGE.WISHLIST_NOT_FOUND);
    }

    return wishlist;
  }
}
