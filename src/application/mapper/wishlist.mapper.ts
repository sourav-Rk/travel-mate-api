import { IPackageEntity } from "../../domain/entities/package.entity";
import { IWishlistEntity } from "../../domain/entities/wishlist.entity";
import { IWishlistModel } from "../../infrastructure/database/models/wishlist.model";
import { PackageStatus } from "../../shared/constants";
import {
  IWishlistAggregationResult,
  WishlistDto,
} from "../dto/response/wishlistDto";

export class WishListMapper {
  static toEntity(doc: IWishlistModel): IWishlistEntity {
    return {
      _id: String(doc._id),
      userId: String(doc.userId),
      packages: doc.packages.map((d) => String(d)),
    };
  }

  static mapToWishlistListing(doc: IWishlistAggregationResult): WishlistDto {
    return {
      userId: String(doc.userId),
      packages: doc.packagesDetails.map((pkg: IPackageEntity) => ({
        _id: String(pkg._id),
        packageId: pkg.packageId ?? "",
        packageName: pkg.packageName,
        title: pkg.title,
        category: pkg.category,
        tags: pkg.tags ?? [],
        images: pkg.images,
        price: pkg.price.toString(),
        duration: {
          days: pkg.duration.days,
          nights: pkg.duration.nights,
        },
        applicationDeadline: pkg.applicationDeadline?.toISOString() ?? "",
        status: pkg.status ?? ("active" as PackageStatus),
        startDate: pkg.startDate.toISOString(),
        endDate: pkg.endDate.toISOString(),
      })),
    };
  }
}
