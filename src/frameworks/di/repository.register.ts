import { container } from "tsyringe";

import { IDBSession } from "../../entities/dbSessionInterfaces/session.interface";
import { IAdminRepository } from "../../entities/repositoryInterfaces/admin/admin-repository.interface";
import { IAddressRepository } from "../../entities/repositoryInterfaces/auth/address-repository.interface";
import { IKYCRepository } from "../../entities/repositoryInterfaces/auth/kyc-repository.interface";
import { IOTPRepository } from "../../entities/repositoryInterfaces/auth/otp-repository.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { IGuideRepository } from "../../entities/repositoryInterfaces/guide/guide-repository.interface";
import { IActivitiesRepository } from "../../entities/repositoryInterfaces/package/activities-repository.interface";
import { IItineraryRepository } from "../../entities/repositoryInterfaces/package/itinerary-repository.interface";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/redis-token-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { AdminRepository } from "../../interfaceAdapters/repositories/admin/admin.repository";
import { AddressRepository } from "../../interfaceAdapters/repositories/auth/address.repository";
import { KYCRepository } from "../../interfaceAdapters/repositories/auth/kyc.repository";
import { OTPRepository } from "../../interfaceAdapters/repositories/auth/otp.repository";
import { ClientRepository } from "../../interfaceAdapters/repositories/client/client.repository";
import { GuideRepository } from "../../interfaceAdapters/repositories/guide/guide.repository";
import { ActivitiesRepository } from "../../interfaceAdapters/repositories/package/activities.repository";
import { ItineraryRepository } from "../../interfaceAdapters/repositories/package/itinerary.repository";
import { PackageRepository } from "../../interfaceAdapters/repositories/package/package.repository";
import { RedisTokenRepository } from "../../interfaceAdapters/repositories/redis/redis-token.repository";
import { VendorRepository } from "../../interfaceAdapters/repositories/vendor/vendor.repository";
import { MongooseDBSession } from "../database/mongooseDBSession/mongooseDBSession";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { BookingRepository } from "../../interfaceAdapters/repositories/booking/booking.repository";
import { IFCMTokenRepository } from "../../entities/repositoryInterfaces/fcmToken/fcmTokenRepository.interface";
import { FCMTokenRepository } from "../../interfaceAdapters/repositories/fcmToken/fcmToken.repository";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/notification-repository.interface";
import { NotificationRepository } from "../../interfaceAdapters/repositories/notification/notification.repository";
import { IWishListRepository } from "../../entities/repositoryInterfaces/wishlist/wishlist-repository.interface";
import { WishlistRepository } from "../../interfaceAdapters/repositories/wishlist/wishlist.repository";
import { IReviewRepository } from "../../entities/repositoryInterfaces/review/review-repository.interface";
import { ReviewRepository } from "../../interfaceAdapters/repositories/review/review.repository";
import { ITokenRepository } from "../../entities/repositoryInterfaces/token/token-repository.interface";
import { TokenRepository } from "../../interfaceAdapters/repositories/token/token.repository";

export class RepositoryRegistry {
  static registerRepositories(): void {
    container.register<IClientRepository>("IClientRepository", {
      useClass: ClientRepository,
    });

    container.register<IVendorRepository>("IVendorRepository", {
      useClass: VendorRepository,
    });

    container.register<IGuideRepository>("IGuideRepository", {
      useClass: GuideRepository,
    });

    container.register<IAdminRepository>("IAdminRepository", {
      useClass: AdminRepository,
    });

    container.register<ITokenRepository>("ITokenRepository", {
      useClass: TokenRepository,
    });

    container.register<IKYCRepository>("IKYCRepository", {
      useClass: KYCRepository,
    });

    container.register<IAddressRepository>("IAddressRepository", {
      useClass: AddressRepository,
    });

    container.register<IOTPRepository>('IOTPRepository',{
      useClass : OTPRepository
    })

    container.register<IPackageRepository>("IPackageRepository", {
      useClass: PackageRepository,
    });

    container.register<IItineraryRepository>("IItineraryRepository", {
      useClass: ItineraryRepository,
    });

    container.register<IActivitiesRepository>("IActivitiesRepository", {
      useClass: ActivitiesRepository,
    });

    container.register<IBookingRepository>("IBookingRepository", {
      useClass: BookingRepository,
    });

    //wishlist repository
    container.register<IWishListRepository>("IWishListRepository", {
      useClass: WishlistRepository,
    });

    //review repository
    container.register<IReviewRepository>("IReviewRepository", {
      useClass: ReviewRepository,
    });

    //fcm token repository
    container.register<IFCMTokenRepository>("IFCMTokenRepository", {
      useClass: FCMTokenRepository,
    });

    //notification repository
    container.register<INotificationRepository>("INotificationRepository", {
      useClass: NotificationRepository,
    });

    //redis token repository
    container.register<IRedisTokenRepository>("IRedisTokenRepository", {
      useClass: RedisTokenRepository,
    });

    //database session
    container.register<IDBSession>("IDBSession", {
      useClass: MongooseDBSession,
    });

  }
}
