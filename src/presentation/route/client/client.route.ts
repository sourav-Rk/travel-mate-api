import express from "express";
import { injectable } from "tsyringe";

import { GetMessagesReqDto } from "../../../application/dto/request/chat.dto";
import {
  UpdateClientProfileDTO,
  UpdatePasswordReqDTO,
} from "../../../application/dto/request/client.dto";
import { GetGuideDetailsForClientReqDTO } from "../../../application/dto/request/guide.dto";
import { MarkReadNotificationReqDTO } from "../../../application/dto/request/notification.dto";
import { BookingPaymentReqDTO } from "../../../application/dto/request/payment.dto";
import { AddReviewReqDTO } from "../../../application/dto/request/review.dto";
import {
  blockMiddleware,
  chatController,
  clientBookingController,
  clientPackageController,
  clientProfileController,
  groupChatController,
  guideInstructionController,
  guideProfileController,
  localGuideController,
  notificationController,
  paymentController,
  reviewController,
  vendorProfileController,
  volunteerPostController,
  walletController,
  wishlistController,
  guideChatController,
  localGuideBookingController,
  badgeController,
} from "../../../infrastructure/dependencyInjection/resolve";
import {
  GetLocalGuidesByLocationReqDTO,
  RequestLocalGuideVerificationReqDTO,
  UpdateLocalGuideAvailabilityReqDTO,
  UpdateLocalGuideProfileReqDTO,
} from "../../../application/dto/request/local-guide.dto";
import {
  CreateVolunteerPostReqDTO,
  GetVolunteerPostsReqDTO,
  GetVolunteerPostsByLocationReqDTO,
  SearchVolunteerPostsReqDTO,
} from "../../../application/dto/request/volunteer-post.dto";
import { asyncHandler } from "../../../shared/async-handler";
import { authorizeRole, verifyAuth } from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { BaseRoute } from "../base.route";
import { CommonUploadRoutes } from "../common/common-upload.route";
import { FcmTokenRoutes } from "../fcmToken/fcmToken.route";
import {
  AcceptQuoteDto,
  CreateQuoteDto,
  DeclineQuoteDto,
} from "../../../application/dto/request/local-guide-booking.dto";

@injectable()
export class ClientRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    // Common file upload routes (for clients)
    this.router.use("/", new CommonUploadRoutes("client").router);

    // Routes to manage client FCM tokens (push notifications)
    this.router.use("/", new FcmTokenRoutes("client").router);

    //===========public routes=========================

    // Handle Stripe webhook events (raw body required)
    this.router.post(
      "/payment/webhook",
      express.raw({ type: "application/json" }),
      asyncHandler(paymentController.handleWebhook.bind(paymentController))
    );

    // ----------------- Package Routes -----------------

    // Get trending packages (public route)
    this.router.get(
      "/packages/trending",
      asyncHandler(
        clientPackageController.getTrendingPackages.bind(
          clientPackageController
        )
      )
    );

    // Get details of a specific package
    this.router.get(
      "/packages/:packageId",
      asyncHandler(
        clientPackageController.getPackageDetails.bind(clientPackageController)
      )
    );

    // Get list of all available packages
    this.router.get(
      "/packages",
      // validationMiddleware(GetAvailablePackagesReqDTO),
      asyncHandler(
        clientPackageController.getAvailablePackages.bind(
          clientPackageController
        )
      )
    );

    this.router.use(
      verifyAuth,
      authorizeRole(["client"]),
      blockMiddleware.checkBlockedStatus
    );

    //==================Authenticated Routes=====================

    // ----------------- Booking Routes -----------------

    // Get details of a specific booking by bookingId
    this.router.get(
      "/booking/:bookingId",
      asyncHandler(
        clientBookingController.getBookingDetails.bind(clientBookingController)
      )
    );

    // Get booking details of a specific package
    this.router.get(
      "/booking/package/:packageId",
      asyncHandler(
        clientBookingController.getBookingDetailOfPackage.bind(
          clientBookingController
        )
      )
    );

    // Get all bookings
    this.router.get(
      "/bookings",
      asyncHandler(
        clientBookingController.getBookings.bind(clientBookingController)
      )
    );

    // Apply for a package
    this.router.post(
      "/booking/apply",
      asyncHandler(
        clientBookingController.applyPackage.bind(clientBookingController)
      )
    );

    //cancell a booking
    this.router.post(
      "/booking/cancel/:bookingId",
      asyncHandler(
        clientBookingController.cancellBooking.bind(clientBookingController)
      )
    );

    // ----------------- Profile Routes -----------------

    // Update or fetch client profile details
    this.router
      .route("/details")
      .put(
        validationMiddleware(UpdateClientProfileDTO),
        asyncHandler(
          clientProfileController.updateClientProfile.bind(
            clientProfileController
          )
        )
      )
      .get(
        asyncHandler(
          clientProfileController.getClientDetails.bind(clientProfileController)
        )
      );

    // Update client password
    this.router.put(
      "/update-password",
      validationMiddleware(UpdatePasswordReqDTO),
      asyncHandler(
        clientProfileController.updatePassword.bind(clientProfileController)
      )
    );

    // ----------------- Notification Routes -----------------

    // Mark a single notification as read
    this.router.patch(
      "/notifications/:notificationId",
      validationMiddleware(MarkReadNotificationReqDTO),
      asyncHandler(
        notificationController.markReadNotification.bind(notificationController)
      )
    );

    // Get all notifications or mark all as read
    this.router
      .route("/notifications")
      .get(
        asyncHandler(
          notificationController.getNotifications.bind(notificationController)
        )
      )
      .patch(
        asyncHandler(
          notificationController.markAsReadAllNotification.bind(
            notificationController
          )
        )
      );

    // ----------------- Payment Routes -----------------

    // Pay advance amount for a booking
    this.router.post(
      "/payment/advance",
      validationMiddleware(BookingPaymentReqDTO),
      asyncHandler(paymentController.payAdvanceAmount.bind(paymentController))
    );

    // Pay full amount for a booking
    this.router.post(
      "/payment/full",
      validationMiddleware(BookingPaymentReqDTO),
      asyncHandler(paymentController.payFullAmount.bind(paymentController))
    );

    // ----------------- Wishlist Routes -----------------

    //get and add routes
    this.router
      .route("/wishlist")
      .get(
        asyncHandler(wishlistController.getWishlist.bind(wishlistController))
      )
      .put(
        asyncHandler(wishlistController.addToWishlist.bind(wishlistController))
      );

    //to remove from the wishlist
    this.router.patch(
      "/wishlist/remove",
      asyncHandler(
        wishlistController.removeFromWishlist.bind(wishlistController)
      )
    );

    // ----------------- Review Routes ----------------

    //get guide reviews
    this.router.get(
      "/reviews/guides/:guideId/:packageId",
      asyncHandler(reviewController.getGuideReviews.bind(reviewController))
    );

    //get packages review
    this.router.get(
      "/reviews/packages/:packageId",
      asyncHandler(reviewController.getReviews.bind(reviewController))
    );

    this.router.post(
      "/review",
      validationMiddleware(AddReviewReqDTO),
      asyncHandler(reviewController.addReview.bind(reviewController))
    );

    // ----------------- Guide Routes ----------------
    this.router.get(
      "/guide/:guideId",
      validationMiddleware(GetGuideDetailsForClientReqDTO),
      asyncHandler(
        guideProfileController.getGuideDetailsForClient.bind(
          guideProfileController
        )
      )
    );

    //--------------=Chat Routes ---------------------
    this.router.get(
      "/messages",
      validationMiddleware(GetMessagesReqDto),
      asyncHandler(chatController.getMessages.bind(chatController))
    );

    this.router.get(
      "/chatroom/:chatroomId",
      asyncHandler(chatController.getChatroom.bind(chatController))
    );

    this.router.get(
      "/history",
      asyncHandler(chatController.getChatHistory.bind(chatController))
    );

    //--------------Wallet Routes ---------------------

    this.router.get(
      "/wallet",
      asyncHandler(walletController.getWalletByUserId.bind(walletController))
    );

    this.router.get(
      "/transactions",
      asyncHandler(
        walletController.getWalletTransactions.bind(walletController)
      )
    );

    //--------------Instructions routes-------------------

    //mark instruction as read
    this.router.put(
      "/instructions/:instructionId",
      asyncHandler(
        guideInstructionController.markInstructionRead.bind(
          guideInstructionController
        )
      )
    );

    //get instructions
    this.router.get(
      "/instructions",
      asyncHandler(
        guideInstructionController.getInstructionsClient.bind(
          guideInstructionController
        )
      )
    );

    //mark all instructions as read
    this.router.put(
      "/instructions",
      asyncHandler(
        guideInstructionController.markAllInstructionsRead.bind(
          guideInstructionController
        )
      )
    );

    //--------------Vendor details routes-------------------
    this.router.get(
      "/vendor/:vendorId",
      asyncHandler(
        vendorProfileController.getVendorDetailsClient.bind(
          vendorProfileController
        )
      )
    );

    //--------------Group Chat routes-------------------
    this.router.get(
      "/groups",
      asyncHandler(groupChatController.getGroups.bind(groupChatController))
    );

    this.router.get(
      "/group-details/:groupId",
      asyncHandler(
        groupChatController.getGroupDetails.bind(groupChatController)
      )
    );

    //--------------Local Guide Routes-------------------
    this.router.post(
      "/local-guide/request-verification",
      validationMiddleware(RequestLocalGuideVerificationReqDTO),
      asyncHandler(
        localGuideController.requestVerification.bind(localGuideController)
      )
    );

    this.router.get(
      "/local-guide/profile",
      asyncHandler(
        localGuideController.getLocalGuideProfile.bind(localGuideController)
      )
    );

    this.router.get(
      "/local-guide/public-profile/:profileId",
      asyncHandler(
        localGuideController.getLocalGuidePublicProfile.bind(
          localGuideController
        )
      )
    );

    this.router.patch(
      "/local-guide/availability",
      validationMiddleware(UpdateLocalGuideAvailabilityReqDTO),
      asyncHandler(
        localGuideController.updateAvailability.bind(localGuideController)
      )
    );

    this.router.patch(
      "/local-guide/profile",
      validationMiddleware(UpdateLocalGuideProfileReqDTO),
      asyncHandler(
        localGuideController.updateProfile.bind(localGuideController)
      )
    );

    this.router.get(
      "/local-guide/search-by-location",
      validationMiddleware(GetLocalGuidesByLocationReqDTO),
      asyncHandler(
        localGuideController.getLocalGuidesByLocation.bind(localGuideController)
      )
    );

    //--------------Volunteer Post Routes -------------------
    this.router.post(
      "/local-guide/posts",
      validationMiddleware(CreateVolunteerPostReqDTO),
      asyncHandler(
        volunteerPostController.createPost.bind(volunteerPostController)
      )
    );

    this.router.put(
      "/local-guide/posts/:postId",
      asyncHandler(
        volunteerPostController.updatePost.bind(volunteerPostController)
      )
    );

    this.router.delete(
      "/local-guide/posts/:postId",
      asyncHandler(
        volunteerPostController.deletePost.bind(volunteerPostController)
      )
    );

    this.router.get(
      "/local-guide/posts",
      validationMiddleware(GetVolunteerPostsReqDTO),
      asyncHandler(
        volunteerPostController.getPosts.bind(volunteerPostController)
      )
    );

    this.router.get(
      "/local-guide/posts/search",
      validationMiddleware(SearchVolunteerPostsReqDTO),
      asyncHandler(
        volunteerPostController.searchPosts.bind(volunteerPostController)
      )
    );

    this.router.get(
      "/local-guide/posts/:postId",
      asyncHandler(
        volunteerPostController.getPost.bind(volunteerPostController)
      )
    );

    this.router.get(
      "/local-guide/posts/location",
      validationMiddleware(GetVolunteerPostsByLocationReqDTO),
      asyncHandler(
        volunteerPostController.getPostsByLocation.bind(volunteerPostController)
      )
    );

    this.router.get(
      "/volunteer-post/search-by-location",
      validationMiddleware(GetVolunteerPostsByLocationReqDTO),
      asyncHandler(
        volunteerPostController.getPostsByLocation.bind(volunteerPostController)
      )
    );

    this.router.post(
      "/local-guide/posts/:postId/like",
      asyncHandler(
        volunteerPostController.likePost.bind(volunteerPostController)
      )
    );

    this.router.delete(
      "/local-guide/posts/:postId/like",
      asyncHandler(
        volunteerPostController.unlikePost.bind(volunteerPostController)
      )
    );

    //--------------- Guide service chat -------------------
    this.router.post(
      "/guide-chat",
      asyncHandler(guideChatController.createRoom.bind(guideChatController))
    );

    this.router.get(
      "/guide-chat/rooms",
      asyncHandler(guideChatController.getRooms.bind(guideChatController))
    );

    this.router.get(
      "/guide-chat/messages/:guideChatRoomId",
      asyncHandler(guideChatController.getMessages.bind(guideChatController))
    );

    this.router.post(
      "/guide-chat/quote",
      validationMiddleware(CreateQuoteDto),
      asyncHandler(
        localGuideBookingController.createQuote.bind(
          localGuideBookingController
        )
      )
    );

    this.router.get(
      "/guide-chat/quotes/pending",
      asyncHandler(
        localGuideBookingController.getPendingQuotes.bind(
          localGuideBookingController
        )
      )
    );

    this.router.post(
      "/guide-chat/quote/accept",
      validationMiddleware(AcceptQuoteDto),
      asyncHandler(
        localGuideBookingController.acceptQuote.bind(
          localGuideBookingController
        )
      )
    );

    this.router.post(
      "/guide-chat/quote/decline",
      validationMiddleware(DeclineQuoteDto),
      asyncHandler(
        localGuideBookingController.declineQuote.bind(
          localGuideBookingController
        )
      )
    );

    //------------------Local Guide Booking Routes-----------------

    this.router.get(
      "/local-guide/bookings",
      asyncHandler(
        localGuideBookingController.getLocalGuideBookings.bind(
          localGuideBookingController
        )
      )
    );

    this.router.post(
      "/local-guide/bookings/:bookingId/pay-advance",
      asyncHandler(
        localGuideBookingController.payAdvanceAmount.bind(
          localGuideBookingController
        )
      )
    );

    this.router.post(
      "/local-guide/bookings/:bookingId/pay-full",
      asyncHandler(
        localGuideBookingController.payFullAmount.bind(
          localGuideBookingController
        )
      )
    );

    this.router.get(
      "/local-guide/bookings/chat-room/:guideChatRoomId",
      asyncHandler(
        guideChatController.getBookingByChatRoom.bind(guideChatController)
      )
    );

    this.router.get(
      "/local-guide/my-service-bookings",
      asyncHandler(
        localGuideBookingController.getLocalGuideBookingsForGuide.bind(
          localGuideBookingController
        )
      )
    );

    this.router.get(
      "/local-guide/bookings/:bookingId",
      asyncHandler(
        localGuideBookingController.getLocalGuideBookingDetails.bind(
          localGuideBookingController
        )
      )
    );

    this.router.post(
      "/local-guide/bookings/:bookingId/complete",
      asyncHandler(
        localGuideBookingController.markServiceComplete.bind(
          localGuideBookingController
        )
      )
    );

    // ----------------- Badge Routes ----------------
    this.router.get(
      "/local-guide/badges",
      asyncHandler(badgeController.getAllBadges.bind(badgeController))
    );

    this.router.get(
      "/local-guide/my-badges",
      asyncHandler(badgeController.getGuideBadges.bind(badgeController))
    );

    this.router.post(
      "/local-guide/evaluate-badges",
      asyncHandler(badgeController.evaluateBadges.bind(badgeController))
    );
  }
}
