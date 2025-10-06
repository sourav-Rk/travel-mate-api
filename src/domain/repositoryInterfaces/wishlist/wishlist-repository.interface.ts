import { WishlistDto } from "../../../application/dto/response/wishlistDto";
import { IWishlistEntity } from "../../entities/wishlist.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IWishListRepository extends IBaseRepository<IWishlistEntity> {
  findByUserId(id: string): Promise<IWishlistEntity | null>;
  getWishlistWithPackageDetails(userId: string): Promise<WishlistDto | null>;
  addToWishList(
    userId: string,
    packageId: string
  ): Promise<IWishlistEntity | null>;
  removeFromWishlist(
    userId: string,
    packageId: string
  ): Promise<IWishlistEntity | null>;
}
