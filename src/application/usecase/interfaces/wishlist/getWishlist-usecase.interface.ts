import { WishlistDto } from "../../../dto/response/wishlistDto";

export interface IGetWishlistUsecase {
  execute(userId: string): Promise<WishlistDto>;
}
