import { WishlistDto } from "../../../shared/dto/wishlistDto";
import { IWishlistEntity } from "../../modelsEntity/wishlist.entity";

export interface IWishListRepository {
  create(data: Partial<IWishlistEntity>): Promise<IWishlistEntity>;
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
