import { injectable } from "tsyringe";
import { IWishListRepository } from "../../../entities/repositoryInterfaces/wishlist/wishlist-repository.interface";
import { IWishlistEntity } from "../../../entities/modelsEntity/wishlist.entity";
import {
  IWishlistModel,
  wishlistDB,
} from "../../../frameworks/database/models/wishlist.model";
import { WishListMapper } from "../../mappers/wishlist.mapper";
import { WishlistDto } from "../../../shared/dto/wishlistDto";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";
import { ERROR_MESSAGE } from "../../../shared/constants";
import mongoose from "mongoose";
import { BaseRepository } from "../baseRepository";

@injectable()
export class WishlistRepository
  extends BaseRepository<IWishlistModel, IWishlistEntity>
  implements IWishListRepository
{
  constructor() {
    super(wishlistDB, WishListMapper.toEntity);
  }

  async findByUserId(userId: string): Promise<IWishlistEntity | null> {
    return wishlistDB.findOne({ userId });
  }
  async getWishlistWithPackageDetails(
    userId: string
  ): Promise<WishlistDto | null> {
    const wishlist = await wishlistDB.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "packages",
          localField: "packages",
          foreignField: "packageId",
          as: "packagesDetails",
        },
      },
    ]);

    if (!wishlist.length) {
      throw new NotFoundError(ERROR_MESSAGE.WISHLIST_NOT_FOUND);
    }

    return WishListMapper.mapToWishlistListing(wishlist[0]);
  }

  async addToWishList(
    userId: string,
    packageId: string
  ): Promise<IWishlistEntity | null> {
    return wishlistDB.findOneAndUpdate(
      { userId },
      { $addToSet: { packages: packageId } },
      { new: true }
    );
  }

  async removeFromWishlist(
    userId: string,
    packageId: string
  ): Promise<IWishlistEntity | null> {
    return wishlistDB.findOneAndUpdate(
      { userId },
      { $pull: { packages: packageId } }
    );
  }
}
