import { container } from "tsyringe";

import { GroupChatService } from "../../application/services/implementations/groupChatService";
import { IGroupChatService } from "../../application/services/interfaces/group-chat-service.interface";
import { CreateActivityUsecase } from "../../application/usecase/implementations/activity/createActivityUsecase";
import { DeleteActivityUsecase } from "../../application/usecase/implementations/activity/deleteActivity.usecase";
import { UpdateActivityUsecase } from "../../application/usecase/implementations/activity/updateActivity.usecase";
import { AddAddressUsecase } from "../../application/usecase/implementations/address/addAddress.usecase";
import { UpdateAddressUsecase } from "../../application/usecase/implementations/address/update-address.usecase";
import { GetAdminSalesReportUsecase } from "../../application/usecase/implementations/admin/get-admin-sales-report.usecase";
import { GetAllUsersUsecase } from "../../application/usecase/implementations/admin/get-all-users.usecase";
import { GetDashboardStatsUsecase } from "../../application/usecase/implementations/admin/get-dashboard-stats.usecase";
import { GetUserByIdUsecase } from "../../application/usecase/implementations/admin/getUserById.usecase";
import { UpdateUserStatusUsecase } from "../../application/usecase/implementations/admin/update-user-status.usecase";
import { AdminUpateVendorStatusUsecase } from "../../application/usecase/implementations/admin/update-vendor-status.usecase";
import { AddKycUsecase } from "../../application/usecase/implementations/auth/addKyc.usecase";
import { BlackListTokenUsecase } from "../../application/usecase/implementations/auth/blacklist-token.usecase";
import { ForgotPasswordResetUsecase } from "../../application/usecase/implementations/auth/forgotPassword-reset.usecase";
import { ForgotPasswordSendMailUsecase } from "../../application/usecase/implementations/auth/forgotPassword-sendMail.usecase";
import { GenerateTokenUseCase } from "../../application/usecase/implementations/auth/generate-token.usecase";
import { GoogleUsecase } from "../../application/usecase/implementations/auth/google.usecase";
import { AdminLoginStrategy } from "../../application/usecase/implementations/auth/login-strategies/admin-login.strategy";
import { ClientGoogleLoginStrategy } from "../../application/usecase/implementations/auth/login-strategies/client-google-login.strategy";
import { ClientLoginStrategy } from "../../application/usecase/implementations/auth/login-strategies/client-login.strategy";
import { GuideLoginStrategy } from "../../application/usecase/implementations/auth/login-strategies/guide-login.strategy";
import { ILoginStrategy } from "../../application/usecase/implementations/auth/login-strategies/login-strategy.interface";
import { VendorLoginStrategy } from "../../application/usecase/implementations/auth/login-strategies/vendor-login.strategy";
import { LoginUsecase } from "../../application/usecase/implementations/auth/login.usecase";
import { LogoutUsecase } from "../../application/usecase/implementations/auth/logout.usecase";
import { RefreshTokenUsecase } from "../../application/usecase/implementations/auth/refresh-token.usecase";
import { ClientRegisterStrategy } from "../../application/usecase/implementations/auth/register-strategies/client-register.strategy";
import { IRegisterStrategy } from "../../application/usecase/implementations/auth/register-strategies/register-strategy.interface";
import { VendorRegisteryStrategy } from "../../application/usecase/implementations/auth/register-strategies/vendor-register.strategy";
import { RegisterUserUsecase } from "../../application/usecase/implementations/auth/registerUser.useCase";
import { ResendOTPUsecase } from "../../application/usecase/implementations/auth/resendOtp.usecase";
import { SendEmailOtpUsecase } from "../../application/usecase/implementations/auth/send-email-otp.usecase";
import { SendEmailUsecase } from "../../application/usecase/implementations/auth/send-email.usecase";
import { VerifyExistingEmail } from "../../application/usecase/implementations/auth/verify-existing-email.usecase";
import { VerifyOtpUsecase } from "../../application/usecase/implementations/auth/verifyOtp.usecase";
import { CreateBadgeUsecase } from "../../application/usecase/implementations/badge/create-badge.usecase";
import { DeleteBadgeUsecase } from "../../application/usecase/implementations/badge/delete-badge.usecase";
import { EvaluateBadgesUsecase } from "../../application/usecase/implementations/badge/evaluate-badges.usecase";
import { GetBadgesUsecase } from "../../application/usecase/implementations/badge/get-badges.usecase";
import { UpdateBadgeUsecase } from "../../application/usecase/implementations/badge/update-badge.usecase";
import { UpdateLocalGuideStatsUsecase } from "../../application/usecase/implementations/badge/update-stats.usecase";
import { ApplyPackageUsecase } from "../../application/usecase/implementations/booking/client-booking/apply-package.usecase";
import { GetClientBookingDetailsUsecase } from "../../application/usecase/implementations/booking/client-booking/get-booking-details-client.usecase";
import { GetBookingDetailsUsecase } from "../../application/usecase/implementations/booking/client-booking/getBooking-details.usecase";
import { GetBookingsUsecase } from "../../application/usecase/implementations/booking/client-booking/getBookings.usecase";
import { GetBookingDetailsGuideUsecase } from "../../application/usecase/implementations/booking/guide-booking/get-booking-details-guide.usecase";
import { GetBookingsGuideUsecase } from "../../application/usecase/implementations/booking/guide-booking/get-bookings.usecase";
import { GetBookingDetailsVendorUsecase } from "../../application/usecase/implementations/booking/vendor-booking/get-booking-details.usecase";
import { GetBookingsUsecaseVendor } from "../../application/usecase/implementations/booking/vendor-booking/get-bookings.usecase";
import { SendPaymentAlertUsecase } from "../../application/usecase/implementations/booking/vendor-booking/send-payment-alert.usecase";
import { CancellBookingUsecase } from "../../application/usecase/implementations/booking-cancell/cancell-booking.usecase";
import { GetCancellationRequests } from "../../application/usecase/implementations/booking-cancell/get-cancellation-requests.usecase";
import { GetCancelledBookingDetailsUsecase } from "../../application/usecase/implementations/booking-cancell/get-cancelled-bookingDetails.usecase";
import { VendorApproveCancellationUsecase } from "../../application/usecase/implementations/booking-cancell/vendorApproveCancellation.usecase";
import { CheckChatRoomUsecase } from "../../application/usecase/implementations/chat/check-chat-room.usecase";
import { GetChatHistoryUsecase } from "../../application/usecase/implementations/chat/get-chat-history.usecase";
import { GetChatroomUsecase } from "../../application/usecase/implementations/chat/get-chatroom.usecase";
import { GetMessagesUsecase } from "../../application/usecase/implementations/chat/get-messages.usecase";
import { MarkAsDeliveredUsecase } from "../../application/usecase/implementations/chat/mark-delivered.usecase";
import { MarkReadUsecase } from "../../application/usecase/implementations/chat/mark-read.usecase";
import { SendMessageUsecase } from "../../application/usecase/implementations/chat/send-message.usecase";
import { GetClientDetailsVendorUsecase } from "../../application/usecase/implementations/client/get-client-details-vendor-usecase";
import { GetClientDetailsUsecase } from "../../application/usecase/implementations/client/getClientDetails.usecase";
import { UpdateClientPasswordUsecase } from "../../application/usecase/implementations/client/update-client-password.usecase";
import { UpdateClientDetailsUsecase } from "../../application/usecase/implementations/client/updateClientDetails.usecase";
import { GenerateSignedUrlUsecase } from "../../application/usecase/implementations/common/generateSignedUrl.usecase";
import { UploadImageUsecase } from "../../application/usecase/implementations/common/uploadImageUsecase";
import { SaveFcmTokenUsecase } from "../../application/usecase/implementations/fcmToken/saveFcmToken.usecase";
import { AddMemberUsecase } from "../../application/usecase/implementations/group-chat/add-member.usecase";
import { CreateGroupChatUsecase } from "../../application/usecase/implementations/group-chat/create-group-chat.usecase";
import { GetGroupChatByPackageUsecase } from "../../application/usecase/implementations/group-chat/get-group-chat-by-package.usecase";
import { GetGroupDetailsUsecase } from "../../application/usecase/implementations/group-chat/get-group-details.usecase";
import { GetGroupMessagesUsecase } from "../../application/usecase/implementations/group-chat/get-group-messages.usecase";
import { GetGroupsUsecase } from "../../application/usecase/implementations/group-chat/getGroups.usecase";
import { SendGroupMessageUsecase } from "../../application/usecase/implementations/group-chat/send-group-message.usecase";
import { GetGuideDetailsClient } from "../../application/usecase/implementations/guide/get-guide-details-client.usecase";
import { GetGuideProfileUsecase } from "../../application/usecase/implementations/guide/getGuideProfileUsecase";
import { ResetPasswordUsecase } from "../../application/usecase/implementations/guide/reset-password.usecase";
import { UpdateGuidePasswordUsecase } from "../../application/usecase/implementations/guide/updateGuidePasswordUsecase";
import { UpdateGuideProfileUsecase } from "../../application/usecase/implementations/guide/update-guide-profile.usecase";
import { CreateGuideChatRoomUsecase } from "../../application/usecase/implementations/guide-chat/create-guide-chat-room.usecase";
import { GetGuideChatRoomsUsecase } from "../../application/usecase/implementations/guide-chat/get-guide-chat-rooms.usecase";
import { GetGuideMessagesUsecase } from "../../application/usecase/implementations/guide-chat/get-guide-messages.usecase";
import { GetPendingQuotesUsecase } from "../../application/usecase/implementations/guide-chat/get-pending-quotes.usecase";
import { MarkGuideMessagesDeliveredUsecase } from "../../application/usecase/implementations/guide-chat/mark-guide-messages-delivered.usecase";
import { MarkGuideMessagesReadUsecase } from "../../application/usecase/implementations/guide-chat/mark-guide-messages-read.usecase";
import { SendGuideMessageUsecase } from "../../application/usecase/implementations/guide-chat/send-guide-message.usecase";
import { CreateInstructionUsecase } from "../../application/usecase/implementations/guide-instructions/create-instruction.usecase";
import { GetInstructionsClientUsecase } from "../../application/usecase/implementations/guide-instructions/get-instructions-client.usecase";
import { MarkAllInstructionsReadUseCase } from "../../application/usecase/implementations/guide-instructions/mark-all-instructons-read.usecase";
import { MarkInstructionReadUseCase } from "../../application/usecase/implementations/guide-instructions/mark-instruction-read.usecase";
import { UpdatePackageStatusUsecaseGuide } from "../../application/usecase/implementations/guideTrips/update-package-status.usecase";
import { AssignedTripsUsecase } from "../../application/usecase/implementations/guideTrips/viewAssignedTrips.usecase";
import { ViewPackageDetailsGuideUsecase } from "../../application/usecase/implementations/guideTrips/viewPackageDetails.usecase";
import { UpdateItineraryUsecase } from "../../application/usecase/implementations/itinerary/updateItinerary.usecase";
import { GetLocalGuideProfileUsecase } from "../../application/usecase/implementations/local-guide/get-local-guide-profile.usecase";
import { GetLocalGuidePublicProfileUsecase } from "../../application/usecase/implementations/local-guide/get-local-guide-public-profile.usecase";
import { GetLocalGuidesByLocationUsecase } from "../../application/usecase/implementations/local-guide/get-local-guides-by-location.usecase";
import { GetPendingVerificationsUsecase } from "../../application/usecase/implementations/local-guide/get-pending-verifications.usecase";
import { RejectLocalGuideUsecase } from "../../application/usecase/implementations/local-guide/reject-local-guide.usecase";
import { RequestLocalGuideVerificationUsecase } from "../../application/usecase/implementations/local-guide/request-local-guide-verification.usecase";
import { UpdateLocalGuideAvailabilityUsecase } from "../../application/usecase/implementations/local-guide/update-local-guide-availability.usecase";
import { UpdateLocalGuideProfileUsecase } from "../../application/usecase/implementations/local-guide/update-local-guide-profile.usecase";
import { VerifyLocalGuideUsecase } from "../../application/usecase/implementations/local-guide/verify-local-guide.usecase";
import { AcceptQuoteUsecase } from "../../application/usecase/implementations/local-guide-booking/accept-quote.usecase";
import { CreateQuoteUsecase } from "../../application/usecase/implementations/local-guide-booking/create-quote.usecase";
import { DeclineQuoteUsecase } from "../../application/usecase/implementations/local-guide-booking/decline-quote.usecase";
import { GetBookingByChatRoomUsecase } from "../../application/usecase/implementations/local-guide-booking/get-booking-by-chat-room.usecase";
import { GetLocalGuideBookingDetailsUsecase } from "../../application/usecase/implementations/local-guide-booking/get-booking-details.usecase";
import { GetLocalGuideBookingsUsecase } from "../../application/usecase/implementations/local-guide-booking/get-bookings.usecase";
import { GetLocalGuideBookingsForGuideUsecase } from "../../application/usecase/implementations/local-guide-booking/get-guide-bookings.usecase";
import { MarkServiceCompleteUsecase } from "../../application/usecase/implementations/local-guide-booking/mark-service-complete.usecase";
import { PayLocalGuideAdvanceAmountUsecase } from "../../application/usecase/implementations/local-guide-booking/pay-advance-amount.usecase";
import { PayLocalGuideFullAmountUsecase } from "../../application/usecase/implementations/local-guide-booking/pay-full-amount.usecase";
import { GetNotificationsUsecase } from "../../application/usecase/implementations/notification/getNotifications.usecase";
import { MarkAsReadAllUsecase } from "../../application/usecase/implementations/notification/mark-as-read-all.usecase";
import { MarkReadNotification } from "../../application/usecase/implementations/notification/mark-read-notification.usecase";
import { AddPackageUsecase } from "../../application/usecase/implementations/package/addPackage.usecase";
import { AssignGuideToTripUsecase } from "../../application/usecase/implementations/package/assign-guide-to-trip.usecase";
import { GetAvailbalePackagesUsecase } from "../../application/usecase/implementations/package/client-package/getAvailable-packages.usecase";
import { GetFeaturedPackagesUsecase } from "../../application/usecase/implementations/package/client-package/getFeaturedPackages.usecase";
import { GetPackageDetailsClientUsecase } from "../../application/usecase/implementations/package/client-package/getPackageDetailsClient.usecase";
import { GetTrendingPackages } from "../../application/usecase/implementations/package/client-package/getTrending-packages.usecase";
import { GetPackageDetailsUsecase } from "../../application/usecase/implementations/package/getPackageDetails.usecase";
import { GetPackageUsecase } from "../../application/usecase/implementations/package/getPackages.usecase";
import { ProcessExpiredPackagesUsecase } from "../../application/usecase/implementations/package/processExpiredPackages.usecase";
import { UpdateBlockStatusUsecase } from "../../application/usecase/implementations/package/updateBlockStatusUsecase";
import { UpdatePackageBasicDetailsUsecase } from "../../application/usecase/implementations/package/updatePackageBasicDetails.usecase";
import { UpdatePackageStatusUsecase } from "../../application/usecase/implementations/package/updatePackageStatus.usecase";
import { UpdatePackageStatusToOngoing } from "../../application/usecase/implementations/package/updatePackageStatusToOngoing-usecase";
import { HandleStripeWebHookUsecase } from "../../application/usecase/implementations/payment/handleStripeWebhook.usecase";
import { PayAdvanceAmountUsecase } from "../../application/usecase/implementations/payment/pay-advance-amount.usecase";
import { PayFullAmountUsecase } from "../../application/usecase/implementations/payment/pay-fullAmount.usecase";
import { AddReviewUsecase } from "../../application/usecase/implementations/review/add-review.usecase";
import { GetGuideReviewsUsecase } from "../../application/usecase/implementations/review/get-guide-review.usecase";
import { GetMyGuideReviewsUsecase } from "../../application/usecase/implementations/review/get-my-guide-reviews.usecase";
import { GetPackageReviewsUsecase } from "../../application/usecase/implementations/review/getPackageReviews.usecase";
import { AddGuideReviewStrategy } from "../../application/usecase/implementations/review/review-strategy/add-guide-review.strategy";
import { AddPackageReviewStrategy } from "../../application/usecase/implementations/review/review-strategy/add-package-review.strategy";
import { IReviewStrategy } from "../../application/usecase/implementations/review/review-strategy/review-strategy.interface";
import { AddGuideUsecase } from "../../application/usecase/implementations/vendor/add-guide.usecase";
import { GetGuideDetailsUsecase } from "../../application/usecase/implementations/vendor/get-guide-details.usecase";
import { GetVendorDashboardStatsUsecase } from "../../application/usecase/implementations/vendor/get-vendor-dashboard-stats.usecase";
import { GetVendorDetailsClientUsecase } from "../../application/usecase/implementations/vendor/get-vendor-details-client.usecase";
import { GetVendorDetailsUsecase } from "../../application/usecase/implementations/vendor/get-vendor-details.usecase";
import { GetVendorDetailsForStatusUsecase } from "../../application/usecase/implementations/vendor/get-vendor-detailsForStatus.usecase";
import { GetVendorSalesReportUsecase } from "../../application/usecase/implementations/vendor/get-vendor-sales-report.usecase";
import { GetAllGuideUsecase } from "../../application/usecase/implementations/vendor/getAllGuides.usecase";
import { UpdateVendorPasswordUsecase } from "../../application/usecase/implementations/vendor/update-vendor-password.usecase";
import { UpdateVendorProfileUsecase } from "../../application/usecase/implementations/vendor/update-vendor-profile.usecase";
import { UpdateVendorStatusUsecase } from "../../application/usecase/implementations/vendor/update-vendor-status.usecase";
import { CreateVolunteerPostUsecase } from "../../application/usecase/implementations/volunteer-post/create-volunteer-post.usecase";
import { DeleteVolunteerPostUsecase } from "../../application/usecase/implementations/volunteer-post/delete-volunteer-post.usecase";
import { GetVolunteerPostUsecase } from "../../application/usecase/implementations/volunteer-post/get-volunteer-post.usecase";
import { GetVolunteerPostsByLocationUsecase } from "../../application/usecase/implementations/volunteer-post/get-volunteer-posts-by-location.usecase";
import { GetVolunteerPostsUsecase } from "../../application/usecase/implementations/volunteer-post/get-volunteer-posts.usecase";
import { LikeVolunteerPostUsecase } from "../../application/usecase/implementations/volunteer-post/like-volunteer-post.usecase";
import { SearchVolunteerPostsUsecase } from "../../application/usecase/implementations/volunteer-post/search-volunteer-posts.usecase";
import { UnlikeVolunteerPostUsecase } from "../../application/usecase/implementations/volunteer-post/unlike-volunteer-post.usecase";
import { UpdateVolunteerPostUsecase } from "../../application/usecase/implementations/volunteer-post/update-volunteer-post.usecase";
import { CreateWalletUsecase } from "../../application/usecase/implementations/wallet/createWallet.usecase";
import { GetWalletByIdUsecase } from "../../application/usecase/implementations/wallet/get-walletById.usecase";
import { GetWalletByUserIdUsecase } from "../../application/usecase/implementations/wallet/get-walletByUserId.usecase";
import { GetWalletTransactionsUsecase } from "../../application/usecase/implementations/wallet/getWalletTransactions.usecase";
import { AddToWishListUsecase } from "../../application/usecase/implementations/wishlist/add-to-wishlist.usecase";
import { GetWishlistUsecase } from "../../application/usecase/implementations/wishlist/getWishlist.usecase";
import { RemoveFromWishListUsecase } from "../../application/usecase/implementations/wishlist/remove-from-wishlist.usecase";
import { ICreateActivityUsecase } from "../../application/usecase/interfaces/activity/createActivity-usecase.interface";
import { IDeleteActivityUsecase } from "../../application/usecase/interfaces/activity/deleteActivity-usecase.interface";
import { IUpdateActivityUsecase } from "../../application/usecase/interfaces/activity/updateActivity-usecase.interface";
import { IUpdateAddressUsecase } from "../../application/usecase/interfaces/address/update-address-usecase.interface";
import { IGetAdminSalesReportUsecase } from "../../application/usecase/interfaces/admin/get-admin-sales-report-usecase.interface";
import { IGetAllUsersUsecase } from "../../application/usecase/interfaces/admin/get-all-users-usecase.interface";
import { IGetDashboardStatsUsecase } from "../../application/usecase/interfaces/admin/get-dashboard-stats-usecase.interface";
import { IGetUserByIdUsecase } from "../../application/usecase/interfaces/admin/getUserById-usecase.interface";
import { IUpdateUserstatusUsecase } from "../../application/usecase/interfaces/admin/update-user-status-usecase.interface";
import { IAdminUpdateVendorStatusUsecase } from "../../application/usecase/interfaces/admin/update-vendor-usecase.interface";
import { IAddAddressUsecase } from "../../application/usecase/interfaces/auth/add-address-usecase.interface";
import { IAddKycUsecase } from "../../application/usecase/interfaces/auth/add-kyc-usecase.interface";
import { IBlackListTokenUsecase } from "../../application/usecase/interfaces/auth/blacklist-token-usecase.interface";
import { IForgotPasswordResetUsecase } from "../../application/usecase/interfaces/auth/forgotPassword-reset-usecase.interface";
import { IForgotPasswordSendMailUsecase } from "../../application/usecase/interfaces/auth/forgotPassword-sendMail-usecase.interface";
import { IGenerateTokenUseCase } from "../../application/usecase/interfaces/auth/generate-token-usecase.interface";
import { IGoogleUsecase } from "../../application/usecase/interfaces/auth/google-usecase.interface";
import { ILoginUsecase } from "../../application/usecase/interfaces/auth/loginUsecase.interface";
import { ILogoutUsecase } from "../../application/usecase/interfaces/auth/logout-usecase.interface";
import { IRefreshTokenUsecase } from "../../application/usecase/interfaces/auth/refresh-token-usecase.interface";
import { IRegisterUserUsecase } from "../../application/usecase/interfaces/auth/registerUsecase.interface";
import { IResendOtpUsecase } from "../../application/usecase/interfaces/auth/resendtOtp.interface";
import { ISendEmailOtpUsecase } from "../../application/usecase/interfaces/auth/send-email-otp-usecase.interface";
import { ISendEmailUsecase } from "../../application/usecase/interfaces/auth/send-email-usecase.interface";
import { IVerifyExistingEmail } from "../../application/usecase/interfaces/auth/verify-existing-email-usecase.interface";
import { IVerifyOtpUsecase } from "../../application/usecase/interfaces/auth/verifyOtpUsecase";
import { ICreateBadgeUsecase } from "../../application/usecase/interfaces/badge/create-badge.interface";
import { IDeleteBadgeUsecase } from "../../application/usecase/interfaces/badge/delete-badge.interface";
import { IEvaluateBadgesUsecase } from "../../application/usecase/interfaces/badge/evaluate-badges.interface";
import { IGetBadgesUsecase } from "../../application/usecase/interfaces/badge/get-badges.interface";
import { IUpdateBadgeUsecase } from "../../application/usecase/interfaces/badge/update-badge.interface";
import { IUpdateLocalGuideStatsUsecase } from "../../application/usecase/interfaces/badge/update-stats.interface";
import { IApplyPackageUsecase } from "../../application/usecase/interfaces/booking/client-booking/apply-package-usecase.interface";
import { IGetClientBookingDetailsUsecase } from "../../application/usecase/interfaces/booking/client-booking/get-booking-details-client-usecase.interface";
import { IGetBookingDetailsClientUsecase } from "../../application/usecase/interfaces/booking/client-booking/get-booking-details-user-usecase.interface";
import { IGetBookingsUsecase } from "../../application/usecase/interfaces/booking/client-booking/getBookings-usecase.interface";
import { IGetBookingDetailsGuideUsecase } from "../../application/usecase/interfaces/booking/guide-booking/get-booking-details-guide-usecase.interface";
import { IGetBookingsGuideUsecase } from "../../application/usecase/interfaces/booking/guide-booking/get-bookings-usecase.interface";
import { IGetBookingDetailsVendorUsecase } from "../../application/usecase/interfaces/booking/vendor-bookings/get-booking-details-usecase.interface";
import { IGetBookingsVendorUsecase } from "../../application/usecase/interfaces/booking/vendor-bookings/get-bookings-usecase.interface";
import { ISendPaymentAlertUsecase } from "../../application/usecase/interfaces/booking/vendor-bookings/send-payment-alert-usecase.interface";
import { ICancellBookingUsecase } from "../../application/usecase/interfaces/booking-cancell/cancell-booking-usecase.interface";
import { IGetCancellationRequests } from "../../application/usecase/interfaces/booking-cancell/get-cancellation-requests-usecase.interface";
import { IGetCancelledBookingDetailsUsecase } from "../../application/usecase/interfaces/booking-cancell/get-cancelled-bookingDetails-usecase.interface";
import { IVendorApproveCancellationUsecase } from "../../application/usecase/interfaces/booking-cancell/vendor-approve-cancellation.-usecase.interface";
import { ICheckChatRoomUsecase } from "../../application/usecase/interfaces/chat/check-chat-room-usecase.interface";
import { IGetChatHistoryUsecase } from "../../application/usecase/interfaces/chat/get-chat-history-usecase.interface";
import { IGetChatroomUsecase } from "../../application/usecase/interfaces/chat/get-chatroom-usecase.interface";
import { IGetMessagesUsecase } from "../../application/usecase/interfaces/chat/get-message-usecase.interface";
import { IMarkAsDeliveredUsecase } from "../../application/usecase/interfaces/chat/mark-delivered-usecase.interface";
import { IMarkReadUsecase } from "../../application/usecase/interfaces/chat/mark-read-usecase.interface";
import { ISendMessageUseCase } from "../../application/usecase/interfaces/chat/send-message-usecase.interface";
import { IGetClientDetailsVendorUsecase } from "../../application/usecase/interfaces/client/get-client-details-vendor-usecase.interface";
import { IGetClientDetailsUsecase } from "../../application/usecase/interfaces/client/getClientDetails-usecase.interface";
import { IUpdateClientPasswordUsecase } from "../../application/usecase/interfaces/client/update-client-password-usecase.interface";
import { IUpdateClientDetailsUsecase } from "../../application/usecase/interfaces/client/updateClientDetails-usecase.interface";
import { IGenerateSignedUrlUsecase } from "../../application/usecase/interfaces/common/generate-signedurl-usecase.interface";
import { IUploadImageUsecase } from "../../application/usecase/interfaces/common/upload-image.usecase";
import { ISaveFcmTokenUsecase } from "../../application/usecase/interfaces/fcmToken/saveFcmToken-usecase.interface";
import { IAddMemberUsecase } from "../../application/usecase/interfaces/group-chat/add-member-usecase.interface";
import { ICreateGroupChatUsecase } from "../../application/usecase/interfaces/group-chat/create-group-chat-usecase.interface";
import { IGetGroupChatByPackageUsecase } from "../../application/usecase/interfaces/group-chat/get-group-chat-by-package-usecase.interface";
import { IGetGroupDetailsUsecase } from "../../application/usecase/interfaces/group-chat/get-group-details-usecase.interface";
import { IGetGroupMessagesUsecase } from "../../application/usecase/interfaces/group-chat/get-group-messages-usecase.interface";
import { IGetGroupsUsecase } from "../../application/usecase/interfaces/group-chat/get-groups-usecase.interface";
import { ISendGroupMessageUsecase } from "../../application/usecase/interfaces/group-chat/send-group-message-usecase.interface";
import { IGetGuideDetailsClientUsecase } from "../../application/usecase/interfaces/guide/get-guide-details-client-usecase.interface";
import { IGetGuideProfileUsecase } from "../../application/usecase/interfaces/guide/getGuideProfile-usecase.interface";
import { IResetPasswordUsecase } from "../../application/usecase/interfaces/guide/reset-password-usecase.interface";
import { IUpdateGuidePasswordUsecase } from "../../application/usecase/interfaces/guide/updateGuidePassword-usecase.interface";
import { IUpdateGuideProfileUsecase } from "../../application/usecase/interfaces/guide/update-guide-profile-usecase.interface";
import { ICreateGuideChatRoomUsecase } from "../../application/usecase/interfaces/guide-chat/create-guide-chat-room.interface";
import { IGetGuideChatRoomsUsecase } from "../../application/usecase/interfaces/guide-chat/get-guide-chat-rooms.interface";
import { IGetGuideMessagesUsecase } from "../../application/usecase/interfaces/guide-chat/get-guide-messages.interface";
import { IGetPendingQuotesUsecase } from "../../application/usecase/interfaces/guide-chat/get-pending-quotes.interface";
import { IMarkGuideMessagesDeliveredUsecase } from "../../application/usecase/interfaces/guide-chat/mark-guide-messages-delivered.interface";
import { IMarkGuideMessagesReadUsecase } from "../../application/usecase/interfaces/guide-chat/mark-guide-messages-read.interface";
import { ISendGuideMessageUsecase } from "../../application/usecase/interfaces/guide-chat/send-guide-message.interface";
import { ICreateInstructionUsecase } from "../../application/usecase/interfaces/guide-instruction/create-instruction-usecase.interface";
import { IGetInstructionsClientUsecase } from "../../application/usecase/interfaces/guide-instruction/get-instructions-client-usecase.interface";
import { IMarkAllInstructionsReadUseCase } from "../../application/usecase/interfaces/guide-instruction/mark-all-instructions-usecase.interface";
import { IMarkInstructionReadUseCase } from "../../application/usecase/interfaces/guide-instruction/mark-instruction-read-usecase.interface";
import { IAssignedTripsUsecase } from "../../application/usecase/interfaces/guideTrips/assignedTrips-usecase.interface";
import { IUpdatePackageStatusUsecaseGuide } from "../../application/usecase/interfaces/guideTrips/update-package-status-usecase.interface";
import { IViewPackageDetailsUsecase } from "../../application/usecase/interfaces/guideTrips/viewPackageDetails-usecase.interface";
import { IUpdateItineraryUsecase } from "../../application/usecase/interfaces/itinerary/updateItinerary-usecase.interface";
import { IGetLocalGuideProfileUsecase } from "../../application/usecase/interfaces/local-guide/get-local-guide-profile-usecase.interface";
import { IGetLocalGuidePublicProfileUsecase } from "../../application/usecase/interfaces/local-guide/get-local-guide-public-profile-usecase.interface";
import { IGetLocalGuidesByLocationUsecase } from "../../application/usecase/interfaces/local-guide/get-local-guides-by-location.interface";
import { IGetPendingVerificationsUsecase } from "../../application/usecase/interfaces/local-guide/get-pending-verifications-usecase.interface";
import { IRejectLocalGuideUsecase } from "../../application/usecase/interfaces/local-guide/reject-local-guide-usecase.interface";
import { IRequestLocalGuideVerificationUsecase } from "../../application/usecase/interfaces/local-guide/request-local-guide-verification-usecase.interface";
import { IUpdateLocalGuideAvailabilityUsecase } from "../../application/usecase/interfaces/local-guide/update-local-guide-availability-usecase.interface";
import { IUpdateLocalGuideProfileUsecase } from "../../application/usecase/interfaces/local-guide/update-local-guide-profile-usecase.interface";
import { IVerifyLocalGuideUsecase } from "../../application/usecase/interfaces/local-guide/verify-local-guide-usecase.interface";
import { IAcceptQuoteUsecase } from "../../application/usecase/interfaces/local-guide-booking/accept-quote.interface";
import { ICreateQuoteUsecase } from "../../application/usecase/interfaces/local-guide-booking/create-quote.interface";
import { IDeclineQuoteUsecase } from "../../application/usecase/interfaces/local-guide-booking/decline-quote.interface";
import { IGetBookingByChatRoomUsecase } from "../../application/usecase/interfaces/local-guide-booking/get-booking-by-chat-room.interface";
import { IGetLocalGuideBookingDetailsUsecase } from "../../application/usecase/interfaces/local-guide-booking/get-booking-details.interface";
import { IGetLocalGuideBookingsUsecase } from "../../application/usecase/interfaces/local-guide-booking/get-bookings.interface";
import { IGetLocalGuideBookingsForGuideUsecase } from "../../application/usecase/interfaces/local-guide-booking/get-guide-bookings.interface";
import { IMarkServiceCompleteUsecase } from "../../application/usecase/interfaces/local-guide-booking/mark-service-complete.interface";
import { IPayLocalGuideAdvanceAmountUsecase } from "../../application/usecase/interfaces/local-guide-booking/pay-advance-amount.interface";
import { IPayLocalGuideFullAmountUsecase } from "../../application/usecase/interfaces/local-guide-booking/pay-full-amount.interface";
import { IGetNotificationsUsecase } from "../../application/usecase/interfaces/notification/get-notifications-usecase.interface";
import { IMarkAsAllReadUsecase } from "../../application/usecase/interfaces/notification/mark-as-read-all-usecase.interface";
import { IMarkReadNotificationUsecase } from "../../application/usecase/interfaces/notification/mark-read-notification-usecase.interface";
import { IAddPackageUsecase } from "../../application/usecase/interfaces/package/addPackage-usecase.interface";
import { IAssignGuideToTripUsecase } from "../../application/usecase/interfaces/package/assign-guide-to-trip-usecase.interface";
import { IGetTrendingPackagesUsecase } from "../../application/usecase/interfaces/package/client-package/get-trending-packages.usecase";
import { IGetAvailablePackagesUsecase } from "../../application/usecase/interfaces/package/client-package/getAvailable-package-usecase.interface";
import { IGetFeaturedPackagesUsecase } from "../../application/usecase/interfaces/package/client-package/getFeaturedPackages-usecase.interface";
import { IGetPackageDetailsClientUsecase } from "../../application/usecase/interfaces/package/client-package/getPackageDetailsClient-usecase.interface";
import { IGetPackageDetailsUsecase } from "../../application/usecase/interfaces/package/getPackageDetails-usecase.interface";
import { IGetPackagesUsecase } from "../../application/usecase/interfaces/package/getPackages-usecase.interface";
import { IProcessExpiredpackagesUsecase } from "../../application/usecase/interfaces/package/processExpiredPackages-usecase.interface";
import { IUpdateBlockStatusUsecase } from "../../application/usecase/interfaces/package/update-block-status-usecase.interface";
import { IUpdatePackageBasicDetailsUsecase } from "../../application/usecase/interfaces/package/updatePackageBasicdetails-usecase.interface";
import { IUpdatePackageStatusUsecase } from "../../application/usecase/interfaces/package/updatePackageStatus-usecase-interface";
import { IUpdatePackageStatusToOngoingUsecase } from "../../application/usecase/interfaces/package/updatePackageStausToOngoing-usecase";
import { IHandleStripeWebHookUsecase } from "../../application/usecase/interfaces/payment/handleStripeWebhook-usecase.interface";
import { IPayAdvanceAmountUsecase } from "../../application/usecase/interfaces/payment/pay-advance-amount-usecase.interface";
import { IPayFullAmountUsecase } from "../../application/usecase/interfaces/payment/pay-fullAmount-usecase.interface";
import { IAddReviewUsecase } from "../../application/usecase/interfaces/review/add-review-usecase.interface";
import { IGetGuideReviewUsecase } from "../../application/usecase/interfaces/review/get-guide-reviews.usecase";
import { IGetMyGuideReviewsUsecase } from "../../application/usecase/interfaces/review/get-my-guide-reviews.usecase.interface";
import { IGetPackageReviewsUsecase } from "../../application/usecase/interfaces/review/getPackageReviews-usecase.interface";
import { IAddGuideUsecase } from "../../application/usecase/interfaces/vendor/add-guide-usecase.interface";
import { IGetGuideDetailsUsecase } from "../../application/usecase/interfaces/vendor/get-guide-details-usecase.interface";
import { IGetVendorDashboardStatsUsecase } from "../../application/usecase/interfaces/vendor/get-vendor-dashboard-stats-usecase.interface";
import { IGetVendorDetailsClientUsecase } from "../../application/usecase/interfaces/vendor/get-vendor-details-client-usecase.interface";
import { IGetVendorDetailsUsecase } from "../../application/usecase/interfaces/vendor/get-vendor-details-usecase.interface";
import { IGetVendorDetailsForStatusUsecase } from "../../application/usecase/interfaces/vendor/get-vendor-details.usecase.interface";
import { IGetVendorSalesReportUsecase } from "../../application/usecase/interfaces/vendor/get-vendor-sales-report-usecase.interface";
import { IGetAllGuidesUsecase } from "../../application/usecase/interfaces/vendor/getAllGuides-usecase.interface";
import { IUpdateVendorPasswordUsecase } from "../../application/usecase/interfaces/vendor/update-vendor-password-usecase.interface";
import { IUpdateVendorProfileUsecase } from "../../application/usecase/interfaces/vendor/update-vendor-profile-usecase.interface";
import { IUpdateVendorStatusUsecase } from "../../application/usecase/interfaces/vendor/update-vendor-status.usecase.interface";
import { ICreateVolunteerPostUsecase } from "../../application/usecase/interfaces/volunteer-post/create-volunteer-post-usecase.interface";
import { IDeleteVolunteerPostUsecase } from "../../application/usecase/interfaces/volunteer-post/delete-volunteer-post-usecase.interface";
import { IGetVolunteerPostUsecase } from "../../application/usecase/interfaces/volunteer-post/get-volunteer-post-usecase.interface";
import { IGetVolunteerPostsByLocationUsecase } from "../../application/usecase/interfaces/volunteer-post/get-volunteer-posts-by-location-usecase.interface";
import { IGetVolunteerPostsUsecase } from "../../application/usecase/interfaces/volunteer-post/get-volunteer-posts-usecase.interface";
import { ILikeVolunteerPostUsecase } from "../../application/usecase/interfaces/volunteer-post/like-volunteer-post-usecase.interface";
import { ISearchVolunteerPostsUsecase } from "../../application/usecase/interfaces/volunteer-post/search-volunteer-posts-usecase.interface";
import { IUnlikeVolunteerPostUsecase } from "../../application/usecase/interfaces/volunteer-post/unlike-volunteer-post-usecase.interface";
import { IUpdateVolunteerPostUsecase } from "../../application/usecase/interfaces/volunteer-post/update-volunteer-post-usecase.interface";
import { ICreateWalletUsecase } from "../../application/usecase/interfaces/wallet/createWallet-usecase.interface";
import { IGetWalletByIdUsecase } from "../../application/usecase/interfaces/wallet/get-walletById-usecase.interface";
import { IGetWalletByUserIdUsecase } from "../../application/usecase/interfaces/wallet/get-walletByUserId-usecase.interface";
import { IGetWalletTransactionsUsecase } from "../../application/usecase/interfaces/wallet/getWalletTransactions-usecase.interface";
import { IAddToWishListUsecase } from "../../application/usecase/interfaces/wishlist/add-to-wishlist-usecase.interface";
import { IGetWishlistUsecase } from "../../application/usecase/interfaces/wishlist/getWishlist-usecase.interface";
import { IRemoveFromWishlistUsecase } from "../../application/usecase/interfaces/wishlist/remove-from-wishlist-usecase.interface";
import { ILogger } from "../../domain/service-interfaces/logger.interface";
import { LoggerMiddleware } from "../../presentation/middlewares/logger.middleware";
import { WinstonLoggerAdapter } from "../service/winston-logger.adapter";

export class UsecaseRegistory {
  static registerUsecases(): void {
    //auth usecases
    container.register<IRegisterUserUsecase>("IRegisterUserUsecase", {
      useClass: RegisterUserUsecase,
    });

    container.register<IVerifyOtpUsecase>("IVerifyOtpUsecase", {
      useClass: VerifyOtpUsecase,
    });

    container.register<ILoginUsecase>("ILoginUsecase", {
      useClass: LoginUsecase,
    });

    container.register<ISendEmailUsecase>("ISendEmailUsecase", {
      useClass: SendEmailUsecase,
    });

    container.register<IVerifyExistingEmail>("IVerifyExistingEmail", {
      useClass: VerifyExistingEmail,
    });

    container.register<IGenerateTokenUseCase>("IGenerateTokenUseCase", {
      useClass: GenerateTokenUseCase,
    });

    container.register<IResendOtpUsecase>("IResendOtpUsecase", {
      useClass: ResendOTPUsecase,
    });

    container.register<IGoogleUsecase>("IGoogleUsecase", {
      useClass: GoogleUsecase,
    });

    container.register<IForgotPasswordSendMailUsecase>(
      "IForgotPasswordSendMailUsecase",
      {
        useClass: ForgotPasswordSendMailUsecase,
      }
    );

    container.register<IForgotPasswordResetUsecase>(
      "IForgotPasswordResetUsecase",
      {
        useClass: ForgotPasswordResetUsecase,
      }
    );

    container.register<ISendEmailOtpUsecase>("ISendEmailOtpUsecase", {
      useClass: SendEmailOtpUsecase,
    });

    container.register<ILogoutUsecase>("ILogoutUsecase", {
      useClass: LogoutUsecase,
    });

    //register strategies
    container.register<IRegisterStrategy>("ClientRegisterStrategy", {
      useClass: ClientRegisterStrategy,
    });

    container.register<IRegisterStrategy>("VendorRegisteryStrategy", {
      useClass: VendorRegisteryStrategy,
    });

    //login strategies
    container.register<ILoginStrategy>("ClientLoginStrategy", {
      useClass: ClientLoginStrategy,
    });

    container.register<ILoginStrategy>("AdminLoginStrategy", {
      useClass: AdminLoginStrategy,
    });

    container.register<ILoginStrategy>("VendorLoginStrategy", {
      useClass: VendorLoginStrategy,
    });

    container.register<ILoginStrategy>("GuideLoginStrategy", {
      useClass: GuideLoginStrategy,
    });

    container.register<ILoginStrategy>("ClientGoogleLoginStrategy", {
      useClass: ClientGoogleLoginStrategy,
    });

    //client usecases
    container.register<IGetClientDetailsUsecase>("IGetClientDetailsUsecase", {
      useClass: GetClientDetailsUsecase,
    });

    container.register<IUpdateClientDetailsUsecase>(
      "IUpdateClientDetailsUsecase",
      {
        useClass: UpdateClientDetailsUsecase,
      }
    );

    container.register<IUpdateClientPasswordUsecase>(
      "IUpdateClientPasswordUsecase",
      {
        useClass: UpdateClientPasswordUsecase,
      }
    );

    container.register<IGetClientDetailsVendorUsecase>(
      "IGetClientDetailsVendorUsecase",
      {
        useClass: GetClientDetailsVendorUsecase,
      }
    );

    //vendor usecases
    container.register<IGetVendorDetailsForStatusUsecase>(
      "IGetVendorDetailsForStatusUsecase",
      {
        useClass: GetVendorDetailsForStatusUsecase,
      }
    );

    container.register<IAddAddressUsecase>("IAddAddressUsecase", {
      useClass: AddAddressUsecase,
    });

    container.register<IAddKycUsecase>("IAddKycUsecase", {
      useClass: AddKycUsecase,
    });

    container.register<IAddGuideUsecase>("IAddGuideUsecase", {
      useClass: AddGuideUsecase,
    });

    container.register<IUpdateVendorStatusUsecase>(
      "IUpdateVendorStatusUsecase",
      {
        useClass: UpdateVendorStatusUsecase,
      }
    );

    container.register<IGetVendorDetailsUsecase>("IGetVendorDetailsUsecase", {
      useClass: GetVendorDetailsUsecase,
    });

    container.register<IUpdateVendorPasswordUsecase>(
      "IUpdateVendorPasswordUsecase",
      {
        useClass: UpdateVendorPasswordUsecase,
      }
    );

    container.register<IUpdateVendorProfileUsecase>(
      "IUpdateVendorProfileUsecase",
      {
        useClass: UpdateVendorProfileUsecase,
      }
    );

    container.register<IGetVendorDetailsClientUsecase>(
      "IGetVendorDetailsClientUsecase",
      {
        useClass: GetVendorDetailsClientUsecase,
      }
    );

    container.register<IGetVendorDashboardStatsUsecase>(
      "IGetVendorDashboardStatsUsecase",
      {
        useClass: GetVendorDashboardStatsUsecase,
      }
    );

    container.register<IGetVendorSalesReportUsecase>(
      "IGetVendorSalesReportUsecase",
      {
        useClass: GetVendorSalesReportUsecase,
      }
    );

    //admin usecases
    container.register<IUpdateVendorStatusUsecase>(
      "IUpdateVendorStatusUsecase",
      {
        useClass: UpdateVendorStatusUsecase,
      }
    );

    container.register<IGetAllUsersUsecase>("IGetAllUsersUsecase", {
      useClass: GetAllUsersUsecase,
    });

    container.register<IUpdateUserstatusUsecase>("IUpdateUserstatusUsecase", {
      useClass: UpdateUserStatusUsecase,
    });

    container.register<IGetUserByIdUsecase>("IGetUserByIdUsecase", {
      useClass: GetUserByIdUsecase,
    });

    container.register<IAdminUpdateVendorStatusUsecase>(
      "IAdminUpdateVendorStatusUsecase",
      {
        useClass: AdminUpateVendorStatusUsecase,
      }
    );

    container.register<IGetDashboardStatsUsecase>(
      "IGetDashboardStatsUsecase",
      {
        useClass: GetDashboardStatsUsecase,
      }
    );

    container.register<IGetAdminSalesReportUsecase>(
      "IGetAdminSalesReportUsecase",
      {
        useClass: GetAdminSalesReportUsecase,
      }
    );

    //guide usecases
    container.register<IResetPasswordUsecase>("IResetPasswordUsecase", {
      useClass: ResetPasswordUsecase,
    });

    container.register<IGetAllGuidesUsecase>("IGetAllGuidesUsecase", {
      useClass: GetAllGuideUsecase,
    });

    container.register<IGetGuideDetailsUsecase>("IGetGuideDetailsUsecase", {
      useClass: GetGuideDetailsUsecase,
    });

    container.register<IGetGuideProfileUsecase>("IGetGuideProfileUsecase", {
      useClass: GetGuideProfileUsecase,
    });

    container.register<IUpdateGuidePasswordUsecase>(
      "IUpdateGuidePasswordUsecase",
      {
        useClass: UpdateGuidePasswordUsecase,
      }
    );

    container.register<IUpdateGuideProfileUsecase>(
      "IUpdateGuideProfileUsecase",
      {
        useClass: UpdateGuideProfileUsecase,
      }
    );

    container.register<IGetGuideDetailsClientUsecase>(
      "IGetGuideDetailsClientUsecase",
      {
        useClass: GetGuideDetailsClient,
      }
    );

    //address usecases
    container.register<IUpdateAddressUsecase>("IUpdateAddressUsecase", {
      useClass: UpdateAddressUsecase,
    });

    //package usecases
    container.register<IAddPackageUsecase>("IAddPackageUsecase", {
      useClass: AddPackageUsecase,
    });

    container.register<IGetPackagesUsecase>("IGetPackagesUsecase", {
      useClass: GetPackageUsecase,
    });

    container.register<IGetPackageDetailsUsecase>("IGetPackageDetailsUsecase", {
      useClass: GetPackageDetailsUsecase,
    });

    container.register<IUpdatePackageBasicDetailsUsecase>(
      "IUpdatePackageBasicDetailsUsecase",
      {
        useClass: UpdatePackageBasicDetailsUsecase,
      }
    );

    container.register<IUpdatePackageStatusUsecase>(
      "IUpdatePackageStatusUsecase",
      {
        useClass: UpdatePackageStatusUsecase,
      }
    );

    container.register<IUpdatePackageStatusToOngoingUsecase>(
      "IUpdatePackageStatusToOngoingUsecase",
      {
        useClass: UpdatePackageStatusToOngoing,
      }
    );

    container.register<IProcessExpiredpackagesUsecase>(
      "IProcessExpiredpackagesUsecase",
      {
        useClass: ProcessExpiredPackagesUsecase,
      }
    );

    //client package usecase
    container.register<IGetAvailablePackagesUsecase>(
      "IGetAvailablePackagesUsecase",
      {
        useClass: GetAvailbalePackagesUsecase,
      }
    );

    container.register<IGetPackageDetailsClientUsecase>(
      "IGetPackageDetailsClientUsecase",
      {
        useClass: GetPackageDetailsClientUsecase,
      }
    );

    container.register<IGetFeaturedPackagesUsecase>(
      "IGetFeaturedPackagesUsecase",
      {
        useClass: GetFeaturedPackagesUsecase,
      }
    );

    container.register<IGetTrendingPackagesUsecase>(
      "IGetTrendingPackagesUsecase",
      {
        useClass: GetTrendingPackages,
      }
    );

    //admin packages usecase
    container.register<IUpdateBlockStatusUsecase>("IUpdateBlockStatusUsecase", {
      useClass: UpdateBlockStatusUsecase,
    });

    //itinerary usecase
    container.register<IUpdateItineraryUsecase>("IUpdateItineraryUsecase", {
      useClass: UpdateItineraryUsecase,
    });

    //activity usecase
    container.register<ICreateActivityUsecase>("ICreateActivityUsecase", {
      useClass: CreateActivityUsecase,
    });

    container.register<IUpdateActivityUsecase>("IUpdateActivityUsecase", {
      useClass: UpdateActivityUsecase,
    });

    container.register<IDeleteActivityUsecase>("IDeleteActivityUsecase", {
      useClass: DeleteActivityUsecase,
    });

    //client booking usecase
    container.register<IApplyPackageUsecase>("IApplyPackageUsecase", {
      useClass: ApplyPackageUsecase,
    });

    container.register<IGetBookingDetailsClientUsecase>(
      "IGetBookingDetailsUsecase",
      {
        useClass: GetBookingDetailsUsecase,
      }
    );

    container.register<IGetBookingsUsecase>("IGetBookingsUsecase", {
      useClass: GetBookingsUsecase,
    });

    container.register<IGetClientBookingDetailsUsecase>(
      "IGetClientBookingDetailsUsecase",
      {
        useClass: GetClientBookingDetailsUsecase,
      }
    );

    //vendor booking usecase
    container.register<IGetBookingsVendorUsecase>("IGetBookingsVendorUsecase", {
      useClass: GetBookingsUsecaseVendor,
    });

    container.register<IGetBookingDetailsVendorUsecase>(
      "IGetBookingDetailsVendorUsecase",
      {
        useClass: GetBookingDetailsVendorUsecase,
      }
    );

    //guide bookings usecase
    container.register<IGetBookingsGuideUsecase>("IGetBookingsGuideUsecase", {
      useClass: GetBookingsGuideUsecase,
    });

    container.register<IGetBookingDetailsGuideUsecase>(
      "IGetBookingDetailsGuideUsecase",
      {
        useClass: GetBookingDetailsGuideUsecase,
      }
    );

    //cancell booking usecase
    container.register<ICancellBookingUsecase>("ICancellBookingUsecase", {
      useClass: CancellBookingUsecase,
    });

    container.register<IVendorApproveCancellationUsecase>(
      "IVendorApproveCancellationUsecase",
      {
        useClass: VendorApproveCancellationUsecase,
      }
    );

    container.register<IGetCancellationRequests>("IGetCancellationRequests", {
      useClass: GetCancellationRequests,
    });

    container.register<IGetCancelledBookingDetailsUsecase>(
      "IGetCancelledBookingDetailsUsecase",
      {
        useClass: GetCancelledBookingDetailsUsecase,
      }
    );

    //guide packages usecases
    container.register<IAssignedTripsUsecase>("IAssignedTripsUsecase", {
      useClass: AssignedTripsUsecase,
    });

    container.register<IViewPackageDetailsUsecase>(
      "IViewPackageDetailsUsecase",
      {
        useClass: ViewPackageDetailsGuideUsecase,
      }
    );

    container.register<IUpdatePackageStatusUsecaseGuide>(
      "IUpdatePackageStatusUsecaseGuide",
      {
        useClass: UpdatePackageStatusUsecaseGuide,
      }
    );

    //payment usecases
    container.register<IPayAdvanceAmountUsecase>("IPayAdvanceAmountUsecase", {
      useClass: PayAdvanceAmountUsecase,
    });

    container.register<IHandleStripeWebHookUsecase>(
      "IHandleStripeWebHookUsecase",
      {
        useClass: HandleStripeWebHookUsecase,
      }
    );

    container.register<IPayFullAmountUsecase>("IPayFullAmountUsecase", {
      useClass: PayFullAmountUsecase,
    });

    //review usecase
    container.register<IAddReviewUsecase>("IAddReviewUsecase", {
      useClass: AddReviewUsecase,
    });

    //review strategies
    container.register<IReviewStrategy>("AddPackageReviewStrategy", {
      useClass: AddPackageReviewStrategy,
    });

    container.register<IReviewStrategy>("AddGuideReviewStrategy", {
      useClass: AddGuideReviewStrategy,
    });

    container.register<IGetPackageReviewsUsecase>("IGetPackageReviewsUsecase", {
      useClass: GetPackageReviewsUsecase,
    });

    container.register<IGetGuideReviewUsecase>("IGetGuideReviewUsecase", {
      useClass: GetGuideReviewsUsecase,
    });

    container.register<IGetMyGuideReviewsUsecase>("IGetMyGuideReviewsUsecase", {
      useClass: GetMyGuideReviewsUsecase,
    });

    container.register<IGetNotificationsUsecase>("IGetNotificationsUsecase", {
      useClass: GetNotificationsUsecase,
    });

    container.register<IMarkReadNotificationUsecase>(
      "IMarkReadNotificationUsecase",
      {
        useClass: MarkReadNotification,
      }
    );

    container.register<IMarkAsAllReadUsecase>("IMarkAsAllReadUsecase", {
      useClass: MarkAsReadAllUsecase,
    });

    //payment alert
    container.register<ISendPaymentAlertUsecase>("ISendPaymentAlertUsecase", {
      useClass: SendPaymentAlertUsecase,
    });

    //wishlist usecases
    container.register<IGetWishlistUsecase>("IGetWishlistUsecase", {
      useClass: GetWishlistUsecase,
    });

    container.register<IAddToWishListUsecase>("IAddToWishListUsecase", {
      useClass: AddToWishListUsecase,
    });

    container.register<IRemoveFromWishlistUsecase>(
      "IRemoveFromWishlistUsecase",
      {
        useClass: RemoveFromWishListUsecase,
      }
    );

    //vendor -> guide usecase
    container.register<IAssignGuideToTripUsecase>("IAssignGuideToTripUsecase", {
      useClass: AssignGuideToTripUsecase,
    });

    //chat usecase
    container.register<ISendMessageUseCase>("ISendMessageUseCase", {
      useClass: SendMessageUsecase,
    });

    container.register<IMarkReadUsecase>("IMarkReadUsecase", {
      useClass: MarkReadUsecase,
    });

    container.register<IGetMessagesUsecase>("IGetMessagesUsecase", {
      useClass: GetMessagesUsecase,
    });

    container.register<IMarkAsDeliveredUsecase>("IMarkAsDeliveredUsecase", {
      useClass: MarkAsDeliveredUsecase,
    });

    // guide service chat usecases
    container.register<ICreateGuideChatRoomUsecase>(
      "ICreateGuideChatRoomUsecase",
      {
        useClass: CreateGuideChatRoomUsecase,
      }
    );

    container.register<IGetGuideChatRoomsUsecase>(
      "IGetGuideChatRoomsUsecase",
      {
        useClass: GetGuideChatRoomsUsecase,
      }
    );

    container.register<ISendGuideMessageUsecase>(
      "ISendGuideMessageUsecase",
      {
        useClass: SendGuideMessageUsecase,
      }
    );

    container.register<IGetGuideMessagesUsecase>(
      "IGetGuideMessagesUsecase",
      {
        useClass: GetGuideMessagesUsecase,
      }
    );

    container.register<IMarkGuideMessagesDeliveredUsecase>(
      "IMarkGuideMessagesDeliveredUsecase",
      {
        useClass: MarkGuideMessagesDeliveredUsecase,
      }
    );

    container.register<IMarkGuideMessagesReadUsecase>(
      "IMarkGuideMessagesReadUsecase",
      {
        useClass: MarkGuideMessagesReadUsecase,
      }
    );

    container.register<ICreateQuoteUsecase>("ICreateQuoteUsecase", {
      useClass: CreateQuoteUsecase,
    });

    container.register<IAcceptQuoteUsecase>("IAcceptQuoteUsecase", {
      useClass: AcceptQuoteUsecase,
    });

    container.register<IDeclineQuoteUsecase>("IDeclineQuoteUsecase", {
      useClass: DeclineQuoteUsecase,
    });

    container.register<IPayLocalGuideAdvanceAmountUsecase>(
      "IPayLocalGuideAdvanceAmountUsecase",
      {
        useClass: PayLocalGuideAdvanceAmountUsecase,
      }
    );

    container.register<IPayLocalGuideFullAmountUsecase>(
      "IPayLocalGuideFullAmountUsecase",
      {
        useClass: PayLocalGuideFullAmountUsecase,
      }
    );

    container.register<IGetBookingByChatRoomUsecase>(
      "IGetBookingByChatRoomUsecase",
      {
        useClass: GetBookingByChatRoomUsecase,
      }
    );

    container.register<IGetLocalGuideBookingsUsecase>(
      "IGetLocalGuideBookingsUsecase",
      {
        useClass: GetLocalGuideBookingsUsecase,
      }
    );

    container.register<IGetLocalGuideBookingsForGuideUsecase>(
      "IGetLocalGuideBookingsForGuideUsecase",
      {
        useClass: GetLocalGuideBookingsForGuideUsecase,
      }
    );

    container.register<IGetLocalGuideBookingDetailsUsecase>(
      "IGetLocalGuideBookingDetailsUsecase",
      {
        useClass: GetLocalGuideBookingDetailsUsecase,
      }
    );

    container.register<IMarkServiceCompleteUsecase>(
      "IMarkServiceCompleteUsecase",
      {
        useClass: MarkServiceCompleteUsecase,
      }
    );

    container.register<IGetPendingQuotesUsecase>("IGetPendingQuotesUsecase", {
      useClass: GetPendingQuotesUsecase,
    });

    //chat-room-usecase
    container.register<ICheckChatRoomUsecase>("ICheckChatRoomUsecase", {
      useClass: CheckChatRoomUsecase,
    });

    container.register<IGetChatHistoryUsecase>("IGetChatHistoryUsecase", {
      useClass: GetChatHistoryUsecase,
    });

    container.register<IGetChatroomUsecase>("IGetChatroomUsecase", {
      useClass: GetChatroomUsecase,
    });

    //wallet usecases
    container.register<ICreateWalletUsecase>("ICreateWalletUsecase", {
      useClass: CreateWalletUsecase,
    });

    container.register<IGetWalletTransactionsUsecase>(
      "IGetWalletTransactionsUsecase",
      {
        useClass: GetWalletTransactionsUsecase,
      }
    );

    container.register<IGetWalletByIdUsecase>("IGetWalletByIdUsecase", {
      useClass: GetWalletByIdUsecase,
    });

    container.register<IGetWalletByUserIdUsecase>("IGetWalletByUserIdUsecase", {
      useClass: GetWalletByUserIdUsecase,
    });

    //guide-instruction usecase
    container.register<ICreateInstructionUsecase>("ICreateInstructionUsecase", {
      useClass: CreateInstructionUsecase,
    });

    container.register<IGetInstructionsClientUsecase>(
      "IGetInstructionsClientUsecase",
      {
        useClass: GetInstructionsClientUsecase,
      }
    );

    container.register<IMarkInstructionReadUseCase>(
      "IMarkInstructionReadUseCase",
      {
        useClass: MarkInstructionReadUseCase,
      }
    );

    container.register<IMarkAllInstructionsReadUseCase>(
      "IMarkAllInstructionsReadUseCase",
      {
        useClass: MarkAllInstructionsReadUseCase,
      }
    );

    //group-chat usecases
    container.register<ICreateGroupChatUsecase>("ICreateGroupChatUsecase", {
      useClass: CreateGroupChatUsecase,
    });

    container.register<IAddMemberUsecase>("IAddMemberUsecase", {
      useClass: AddMemberUsecase,
    });

    container.register<IGetGroupChatByPackageUsecase>(
      "IGetGroupChatByPackageUsecase",
      {
        useClass: GetGroupChatByPackageUsecase,
      }
    );

    container.register<IGetGroupMessagesUsecase>("IGetGroupMessagesUsecase", {
      useClass: GetGroupMessagesUsecase,
    });

    container.register<ISendGroupMessageUsecase>("ISendGroupMessageUsecase", {
      useClass: SendGroupMessageUsecase,
    });

    container.register<IGroupChatService>("IGroupChatService", {
      useClass: GroupChatService,
    });

    container.register<IGetGroupsUsecase>("IGetGroupsUsecase", {
      useClass: GetGroupsUsecase,
    });

    container.register<IGetGroupDetailsUsecase>("IGetGroupDetailsUsecase", {
      useClass: GetGroupDetailsUsecase,
    });

    //token
    container.register<IBlackListTokenUsecase>("IBlackListTokenUsecase", {
      useClass: BlackListTokenUsecase,
    });

    container.register<IRefreshTokenUsecase>("IRefreshTokenUsecase", {
      useClass: RefreshTokenUsecase,
    });

    //fcm token usecase
    container.register<ISaveFcmTokenUsecase>("ISaveFcmTokenUsecase", {
      useClass: SaveFcmTokenUsecase,
    });

    //image upload usecase
    container.register<IUploadImageUsecase>("IUploadImageUsecase", {
      useClass: UploadImageUsecase,
    });

    container.register<IGenerateSignedUrlUsecase>("IGenerateSignedUrlUsecase", {
      useClass: GenerateSignedUrlUsecase,
    });

    //local guide usecases
    container.register<IRequestLocalGuideVerificationUsecase>(
      "IRequestLocalGuideVerificationUsecase",
      {
        useClass: RequestLocalGuideVerificationUsecase,
      }
    );

    container.register<IGetPendingVerificationsUsecase>(
      "IGetPendingVerificationsUsecase",
      {
        useClass: GetPendingVerificationsUsecase,
      }
    );

    container.register<IGetLocalGuideProfileUsecase>(
      "IGetLocalGuideProfileUsecase",
      {
        useClass: GetLocalGuideProfileUsecase,
      }
    );
    container.register<IGetLocalGuidePublicProfileUsecase>(
      "IGetLocalGuidePublicProfileUsecase",
      {
        useClass: GetLocalGuidePublicProfileUsecase,
      }
    );

    container.register<IGetLocalGuidesByLocationUsecase>(
      "IGetLocalGuidesByLocationUsecase",
      {
        useClass: GetLocalGuidesByLocationUsecase,
      }
    );

  container.register<IUpdateLocalGuideAvailabilityUsecase>(
    "IUpdateLocalGuideAvailabilityUsecase",
    {
      useClass: UpdateLocalGuideAvailabilityUsecase,
    }
  );

  container.register<IUpdateLocalGuideProfileUsecase>(
    "IUpdateLocalGuideProfileUsecase",
    {
      useClass: UpdateLocalGuideProfileUsecase,
    }
  );

    container.register<IVerifyLocalGuideUsecase>("IVerifyLocalGuideUsecase", {
      useClass: VerifyLocalGuideUsecase,
    });

    container.register<IRejectLocalGuideUsecase>("IRejectLocalGuideUsecase", {
      useClass: RejectLocalGuideUsecase,
    });

    //volunteer post usecases
    container.register<ICreateVolunteerPostUsecase>(
      "ICreateVolunteerPostUsecase",
      {
        useClass: CreateVolunteerPostUsecase,
      }
    );

    container.register<IUpdateVolunteerPostUsecase>(
      "IUpdateVolunteerPostUsecase",
      {
        useClass: UpdateVolunteerPostUsecase,
      }
    );

    container.register<IDeleteVolunteerPostUsecase>(
      "IDeleteVolunteerPostUsecase",
      {
        useClass: DeleteVolunteerPostUsecase,
      }
    );

    container.register<IGetVolunteerPostUsecase>("IGetVolunteerPostUsecase", {
      useClass: GetVolunteerPostUsecase,
    });

    container.register<IGetVolunteerPostsUsecase>(
      "IGetVolunteerPostsUsecase",
      {
        useClass: GetVolunteerPostsUsecase,
      }
    );

    container.register<IGetVolunteerPostsByLocationUsecase>(
      "IGetVolunteerPostsByLocationUsecase",
      {
        useClass: GetVolunteerPostsByLocationUsecase,
      }
    );

    container.register<ISearchVolunteerPostsUsecase>(
      "ISearchVolunteerPostsUsecase",
      {
        useClass: SearchVolunteerPostsUsecase,
      }
    );

    container.register<ILikeVolunteerPostUsecase>(
      "ILikeVolunteerPostUsecase",
      {
        useClass: LikeVolunteerPostUsecase,
      }
    );

    container.register<IUnlikeVolunteerPostUsecase>(
      "IUnlikeVolunteerPostUsecase",
      {
        useClass: UnlikeVolunteerPostUsecase,
      }
    );

    //badge usecases
    container.register<IUpdateLocalGuideStatsUsecase>(
      "IUpdateLocalGuideStatsUsecase",
      {
        useClass: UpdateLocalGuideStatsUsecase,
      }
    );

    container.register<IEvaluateBadgesUsecase>("IEvaluateBadgesUsecase", {
      useClass: EvaluateBadgesUsecase,
    });

    container.register<IGetBadgesUsecase>("IGetBadgesUsecase", {
      useClass: GetBadgesUsecase,
    });

    container.register<ICreateBadgeUsecase>("ICreateBadgeUsecase", {
      useClass: CreateBadgeUsecase,
    });

    container.register<IUpdateBadgeUsecase>("IUpdateBadgeUsecase", {
      useClass: UpdateBadgeUsecase,
    });

    container.register<IDeleteBadgeUsecase>("IDeleteBadgeUsecase", {
      useClass: DeleteBadgeUsecase,
    });

    // ------logger--------
    container.register<ILogger>("ILogger", {
      useClass: WinstonLoggerAdapter,
    });

    container.register<LoggerMiddleware>("LoggerMiddleware", {
      useClass: LoggerMiddleware,
    });
  }
}
