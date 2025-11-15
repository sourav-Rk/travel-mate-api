import mongoose from "mongoose";
import { injectable } from "tsyringe";

import { IWishlistAggregationResult, WishlistDto } from "../../../application/dto/response/wishlistDto";
import { WishListMapper } from "../../../application/mapper/wishlist.mapper";
import { IWishlistEntity } from "../../../domain/entities/wishlist.entity";
import { NotFoundError } from "../../../domain/errors/notFoundError";
import { IWishListRepository } from "../../../domain/repositoryInterfaces/wishlist/wishlist-repository.interface";
import { ERROR_MESSAGE } from "../../../shared/constants";
import {
  IWishlistModel,
  wishlistDB,
} from "../../database/models/wishlist.model";
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
    const wishlist = await wishlistDB.aggregate<IWishlistAggregationResult>([
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
