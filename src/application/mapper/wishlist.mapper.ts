import { IWishlistEntity } from "../../domain/entities/wishlist.entity";
import { IWishlistModel } from "../../infrastructure/database/models/wishlist.model";
import {
  PackageDetailsWishlistDto,
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

  static mapToWishlistListing(doc: any): WishlistDto {
    return {
      userId: String(doc.userId),
      packages: doc.packagesDetails.map((pkg: any) => ({
        _id: String(pkg._id),
        packageId: pkg.packageId,
        packageName: pkg.packageName,
        title: pkg.title,
        category: pkg.category,
        tags: pkg.tags,
        images: pkg.images,
        price: pkg.price,
        duration: {
          days: pkg.duration.days,
          nights: pkg.duration.nights,
        },
        applicationDeadline: pkg.applicationDeadline,
        status: pkg.status,
        startDate: pkg.startDate,
        endDate: pkg.endDate,
      })),
    };
  }
}
