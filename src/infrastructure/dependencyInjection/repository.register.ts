import { container } from "tsyringe";

import { IAdminRepository } from "../../domain/repositoryInterfaces/admin/admin-repository.interface";
import { IAddressRepository } from "../../domain/repositoryInterfaces/auth/address-repository.interface";
import { IKYCRepository } from "../../domain/repositoryInterfaces/auth/kyc-repository.interface";
import { IOTPRepository } from "../../domain/repositoryInterfaces/auth/otp-repository.interface";
import { IBookingRepository } from "../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { IChatRoomRepository } from "../../domain/repositoryInterfaces/chatroom/chatroom-repository.interface";
import { IGuideChatRoomRepository } from "../../domain/repositoryInterfaces/guide-chat/guide-chat-room-repository.interface";
import { IGuideMessageRepository } from "../../domain/repositoryInterfaces/guide-chat/guide-message-repository.interface";
import { IClientRepository } from "../../domain/repositoryInterfaces/client/client.repository.interface";
import { IFCMTokenRepository } from "../../domain/repositoryInterfaces/fcmToken/fcmTokenRepository.interface";
import { IGroupChatRepository } from "../../domain/repositoryInterfaces/group-chat/group-chat-repository.interface";
import { IGroupMessageRepository } from "../../domain/repositoryInterfaces/group-chat/group-message-repository.interface";
import { IGuideRepository } from "../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { IGuideInstructionRepository } from "../../domain/repositoryInterfaces/guide-instruction/guide-instruction-repository.interface";
import { ILocalGuideProfileRepository } from "../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { ILocalGuideBookingRepository } from "../../domain/repositoryInterfaces/local-guide-booking/local-guide-booking-repository.interface";
import { IPostLikeRepository } from "../../domain/repositoryInterfaces/post-like/post-like-repository.interface";
import { IVolunteerPostRepository } from "../../domain/repositoryInterfaces/volunteer-post/volunteer-post-repository.interface";
import { IMessageRepository } from "../../domain/repositoryInterfaces/message/message-repository.interface";
import { INotificationRepository } from "../../domain/repositoryInterfaces/notification/notification-repository.interface";
import { IActivitiesRepository } from "../../domain/repositoryInterfaces/package/activities-repository.interface";
import { IItineraryRepository } from "../../domain/repositoryInterfaces/package/itinerary-repository.interface";
import { IPackageRepository } from "../../domain/repositoryInterfaces/package/package-repository.interface";
import { IRedisTokenRepository } from "../../domain/repositoryInterfaces/redis/redis-token-repository.interface";
import { IReviewRepository } from "../../domain/repositoryInterfaces/review/review-repository.interface";
import { IVendorRepository } from "../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { IWalletRepository } from "../../domain/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletTransactionsRepository } from "../../domain/repositoryInterfaces/wallet/wallet-transactions-repository.interface";
import { IWishListRepository } from "../../domain/repositoryInterfaces/wishlist/wishlist-repository.interface";
import { MongooseDBSession } from "../database/mongooseDBSession/mongooseDBSession";
import { IDBSession } from "../interface/session.interface";
import { AdminRepository } from "../repository/admin/admin.repository";
import { AddressRepository } from "../repository/auth/address.repository";
import { KYCRepository } from "../repository/auth/kyc.repository";
import { OTPRepository } from "../repository/auth/otp.repository";
import { BookingRepository } from "../repository/booking/booking.repository";
import { ChatRoomRepository } from "../repository/chatroom/chatroom-repository";
import { GuideChatRoomRepository } from "../repository/guide-chat/guide-chat-room.repository";
import { GuideMessageRepository } from "../repository/guide-chat/guide-message.repository";
import { ClientRepository } from "../repository/client/client.repository";
import { FCMTokenRepository } from "../repository/fcmToken/fcmToken.repository";
import { GroupChatRepository } from "../repository/group-chat/group-chat.repository";
import { GroupMessageRepository } from "../repository/group-chat/group-message.repository";
import { GuideRepository } from "../repository/guide/guide.repository";
import { GuideInstructionRepository } from "../repository/guide-instruction/guide-instruction.repository";
import { LocalGuideProfileRepository } from "../repository/local-guide-profile/local-guide-profile.repository";
import { LocalGuideBookingRepository } from "../repository/local-guide-booking/local-guide-booking.repository";
import { VolunteerPostRepository } from "../repository/volunteer-post/volunteer-post.repository";
import { PostLikeRepository } from "../repository/post-like/post-like.repository";
import { MessageRepository } from "../repository/message/message.repository";
import { NotificationRepository } from "../repository/notification/notification.repository";
import { ActivitiesRepository } from "../repository/package/activities.repository";
import { ItineraryRepository } from "../repository/package/itinerary.repository";
import { PackageRepository } from "../repository/package/package.repository";
import { RedisTokenRepository } from "../repository/redis/redis-token.repository";
import { ReviewRepository } from "../repository/review/review.repository";
import { VendorRepository } from "../repository/vendor/vendor.repository";
import { WalletTransactionsRepository } from "../repository/wallet/wallet-transactions.repository";
import { WalletRepository } from "../repository/wallet/wallet.repository";
import { WishlistRepository } from "../repository/wishlist/wishlist.repository";

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

    container.register<IGuideMessageRepository>("IGuideMessageRepository", {
      useClass: GuideMessageRepository,
    });

    //chatroom repository
    container.register<IChatRoomRepository>('IChatRoomRepository',{
      useClass : ChatRoomRepository
    });

    container.register<IGuideChatRoomRepository>("IGuideChatRoomRepository", {
      useClass: GuideChatRoomRepository,
    });

    //wallet repositorry
    container.register<IWalletRepository>('IWalletRepository',{
      useClass : WalletRepository
    });

    //wallet transaction repository
    container.register<IWalletTransactionsRepository>('IWalletTransactionsRepository',{
      useClass : WalletTransactionsRepository
    });

    //guide-instruction repository
    container.register<IGuideInstructionRepository>('IGuideInstructionRepository',{
      useClass : GuideInstructionRepository
    });

    container.register<IGroupChatRepository>('IGroupChatRepository',{
      useClass : GroupChatRepository
    });

    container.register<IGroupMessageRepository>('IGroupMessageRepository',{
      useClass : GroupMessageRepository
    })

    //local guide profile repository
    container.register<ILocalGuideProfileRepository>('ILocalGuideProfileRepository',{
      useClass : LocalGuideProfileRepository
    })

    //local guide booking repository
    container.register<ILocalGuideBookingRepository>('ILocalGuideBookingRepository',{
      useClass : LocalGuideBookingRepository
    })

    //volunteer post repository
    container.register<IVolunteerPostRepository>('IVolunteerPostRepository',{
      useClass : VolunteerPostRepository
    })

    //post like repository
    container.register<IPostLikeRepository>('IPostLikeRepository',{
      useClass : PostLikeRepository
    })

    //database session
    container.register<IDBSession>("IDBSession", {
      useClass: MongooseDBSession,
    });
  }
}
