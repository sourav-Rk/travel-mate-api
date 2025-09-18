import { WishlistDto } from "../../../shared/dto/wishlistDto";

export interface IGetWishlistUsecase {
    execute(userId : string) : Promise<WishlistDto>
}