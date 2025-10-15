import { container } from "tsyringe";

import { IDBSession } from "../interface/session.interface";
import { IAdminRepository } from "../../domain/repositoryInterfaces/admin/admin-repository.interface";
import { IAddressRepository } from "../../domain/repositoryInterfaces/auth/address-repository.interface";
import { IKYCRepository } from "../../domain/repositoryInterfaces/auth/kyc-repository.interface";
import { IOTPRepository } from "../../domain/repositoryInterfaces/auth/otp-repository.interface";
import { IClientRepository } from "../../domain/repositoryInterfaces/client/client.repository.interface";
import { IGuideRepository } from "../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { IActivitiesRepository } from "../../domain/repositoryInterfaces/package/activities-repository.interface";
import { IItineraryRepository } from "../../domain/repositoryInterfaces/package/itinerary-repository.interface";
import { IPackageRepository } from "../../domain/repositoryInterfaces/package/package-repository.interface";
import { IRedisTokenRepository } from "../../domain/repositoryInterfaces/redis/redis-token-repository.interface";
import { IVendorRepository } from "../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { AdminRepository } from "../repository/admin/admin.repository";
import { AddressRepository } from "../repository/auth/address.repository";
import { KYCRepository } from "../repository/auth/kyc.repository";
import { OTPRepository } from "../repository/auth/otp.repository";
import { ClientRepository } from "../repository/client/client.repository";
import { GuideRepository } from "../repository/guide/guide.repository";
import { ActivitiesRepository } from "../repository/package/activities.repository";
import { ItineraryRepository } from "../repository/package/itinerary.repository";
import { PackageRepository } from "../repository/package/package.repository";
import { RedisTokenRepository } from "../repository/redis/redis-token.repository";
import { VendorRepository } from "../repository/vendor/vendor.repository";
import { MongooseDBSession } from "../database/mongooseDBSession/mongooseDBSession";
import { IBookingRepository } from "../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { BookingRepository } from "../repository/booking/booking.repository";
import { IFCMTokenRepository } from "../../domain/repositoryInterfaces/fcmToken/fcmTokenRepository.interface";
import { FCMTokenRepository } from "../repository/fcmToken/fcmToken.repository";
import { INotificationRepository } from "../../domain/repositoryInterfaces/notification/notification-repository.interface";
import { NotificationRepository } from "../repository/notification/notification.repository";
import { IWishListRepository } from "../../domain/repositoryInterfaces/wishlist/wishlist-repository.interface";
import { WishlistRepository } from "../repository/wishlist/wishlist.repository";
import { IReviewRepository } from "../../domain/repositoryInterfaces/review/review-repository.interface";
import { ReviewRepository } from "../repository/review/review.repository";
import { IMessageRepository } from "../../domain/repositoryInterfaces/message/message-repository.interface";
import { MessageRepository } from "../repository/message/message.repository";
import { IChatRoomRepository } from "../../domain/repositoryInterfaces/chatroom/chatroom-repository.interface";
import { ChatRoomRepository } from "../repository/chatroom/chatroom-repository";

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

    container.register<IKYCRepository>("IKYCRepository", {
      useClass: KYCRepository,
    });

    container.register<IAddressRepository>("IAddressRepository", {
      useClass: AddressRepository,
    });

    container.register<IOTPRepository>("IOTPRepository", {
      useClass: OTPRepository,
    });

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

    //message repository
    container.register<IMessageRepository>('IMessageRepository',{
      useClass : MessageRepository
    });

    //chatroom repository
    container.register<IChatRoomRepository>('IChatRoomRepository',{
      useClass : ChatRoomRepository
    });

    //database session
    container.register<IDBSession>("IDBSession", {
      useClass: MongooseDBSession,
    });
  }
}
