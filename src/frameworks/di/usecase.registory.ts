import { container } from "tsyringe";

import { IUpdateAddressUsecase } from "../../entities/useCaseInterfaces/address/update-address-usecase.interface";
import { IGetAllUsersUsecase } from "../../entities/useCaseInterfaces/admin/get-all-users-usecase.interface";
import { IGetUserByIdUsecase } from "../../entities/useCaseInterfaces/admin/getUserById-usecase.interface";
import { IUpdateUserstatusUsecase } from "../../entities/useCaseInterfaces/admin/update-user-status-usecase.interface";
import { IAdminUpdateVendorStatusUsecase } from "../../entities/useCaseInterfaces/admin/update-vendor-usecase.interface";
import { IAddAddressUsecase } from "../../entities/useCaseInterfaces/auth/add-address-usecase.interface";
import { IAddKycUsecase } from "../../entities/useCaseInterfaces/auth/add-kyc-usecase.interface";
import { IBlackListTokenUsecase } from "../../entities/useCaseInterfaces/auth/blacklist-token-usecase.interface";
import { IForgotPasswordResetUsecase } from "../../entities/useCaseInterfaces/auth/forgotPassword-reset-usecase.interface";
import { IForgotPasswordSendMailUsecase } from "../../entities/useCaseInterfaces/auth/forgotPassword-sendMail-usecase.interface";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/auth/generate-token-usecase.interface";
import { IGoogleUsecase } from "../../entities/useCaseInterfaces/auth/google-usecase.interface";
import { ILoginUsecase } from "../../entities/useCaseInterfaces/auth/loginUsecase.interface";
import { IRefreshTokenUsecase } from "../../entities/useCaseInterfaces/auth/refresh-token-usecase.interface";
import { IRegisterUserUsecase } from "../../entities/useCaseInterfaces/auth/registerUsecase.interface";
import { IResendOtpUsecase } from "../../entities/useCaseInterfaces/auth/resendtOtp.interface";
import { ISendEmailOtpUsecase } from "../../entities/useCaseInterfaces/auth/send-email-otp-usecase.interface";
import { ISendEmailUsecase } from "../../entities/useCaseInterfaces/auth/send-email-usecase.interface";
import { IVerifyExistingEmail } from "../../entities/useCaseInterfaces/auth/verify-existing-email-usecase.interface";
import { IVerifyOtpUsecase } from "../../entities/useCaseInterfaces/auth/verifyOtpUsecase";
import { IGetClientDetailsUsecase } from "../../entities/useCaseInterfaces/client/getClientDetails-usecase.interface";
import { IUpdateClientPasswordUsecase } from "../../entities/useCaseInterfaces/client/update-client-password-usecase.interface";
import { IUpdateClientDetailsUsecase } from "../../entities/useCaseInterfaces/client/updateClientDetails-usecase.interface";
import { IGenerateSignedUrlUsecase } from "../../entities/useCaseInterfaces/common/generate-signedurl-usecase.interface";
import { IUploadImageUsecase } from "../../entities/useCaseInterfaces/common/upload-image.usecase";
import { IGetGuideProfileUsecase } from "../../entities/useCaseInterfaces/guide/getGuideProfile-usecase.interface";
import { IResetPasswordUsecase } from "../../entities/useCaseInterfaces/guide/reset-password-usecase.interface";
import { IUpdateGuidePasswordUsecase } from "../../entities/useCaseInterfaces/guide/updateGuidePassword-usecase.interface";
import { IAddGuideUsecase } from "../../entities/useCaseInterfaces/vendor/add-guide-usecase.interface";
import { IGetGuideDetailsUsecase } from "../../entities/useCaseInterfaces/vendor/get-guide-details-usecase.interface";
import { IGetVendorDetailsUsecase } from "../../entities/useCaseInterfaces/vendor/get-vendor-details-usecase.interface";
import { IGetVendorDetailsForStatusUsecase } from "../../entities/useCaseInterfaces/vendor/get-vendor-details.usecase.interface";
import { IGetAllGuidesUsecase } from "../../entities/useCaseInterfaces/vendor/getAllGuides-usecase.interface";
import { IUpdateVendorPasswordUsecase } from "../../entities/useCaseInterfaces/vendor/update-vendor-password-usecase.interface";
import { IUpdateVendorProfileUsecase } from "../../entities/useCaseInterfaces/vendor/update-vendor-profile-usecase.interface";
import { IUpdateVendorStatusUsecase } from "../../entities/useCaseInterfaces/vendor/update-vendor-status.usecase.interface";
import { LoggerMiddleware } from "../../interfaceAdapters/middlewares/logger.middleware";
import { ILogger } from "../../interfaceAdapters/services/logger/logger.interface";
import { WinstonLoggerAdapter } from "../../interfaceAdapters/services/logger/winston-logger.adapter";
import { AddAddressUsecase } from "../../useCases/address/addAddress.usecase";
import { UpdateAddressUsecase } from "../../useCases/address/update-address.usecase";
import { GetAllUsersUsecase } from "../../useCases/admin/get-all-users.usecase";
import { GetUserByIdUsecase } from "../../useCases/admin/getUserById.usecase";
import { UpdateUserStatusUsecase } from "../../useCases/admin/update-user-status.usecase";
import { AdminUpateVendorStatusUsecase } from "../../useCases/admin/update-vendor-status.usecase";
import { AddKycUsecase } from "../../useCases/auth/addKyc.usecase";
import { BlackListTokenUsecase } from "../../useCases/auth/blacklist-token.usecase";
import { ForgotPasswordResetUsecase } from "../../useCases/auth/forgotPassword-reset.usecase";
import { ForgotPasswordSendMailUsecase } from "../../useCases/auth/forgotPassword-sendMail.usecase";
import { GenerateTokenUseCase } from "../../useCases/auth/generate-token.usecase";
import { GoogleUsecase } from "../../useCases/auth/google.usecase";
import { AdminLoginStrategy } from "../../useCases/auth/login-strategies/admin-login.strategy";
import { ClientGoogleLoginStrategy } from "../../useCases/auth/login-strategies/client-google-login.strategy";
import { ClientLoginStrategy } from "../../useCases/auth/login-strategies/client-login.strategy";
import { GuideLoginStrategy } from "../../useCases/auth/login-strategies/guide-login.strategy";
import { ILoginStrategy } from "../../useCases/auth/login-strategies/login-strategy.interface";
import { VendorLoginStrategy } from "../../useCases/auth/login-strategies/vendor-login.strategy";
import { LoginUsecase } from "../../useCases/auth/login.usecase";
import { RefreshTokenUsecase } from "../../useCases/auth/refresh-token.usecase";
import { ClientRegisterStrategy } from "../../useCases/auth/register-strategies/client-register.strategy";
import { IRegisterStrategy } from "../../useCases/auth/register-strategies/register-strategy.interface";
import { VendorRegisteryStrategy } from "../../useCases/auth/register-strategies/vendor-register.strategy";
import { RegisterUserUsecase } from "../../useCases/auth/registerUser.useCase";
import { ResendOTPUsecase } from "../../useCases/auth/resendOtp.usecase";
import { SendEmailOtpUsecase } from "../../useCases/auth/send-email-otp.usecase";
import { SendEmailUsecase } from "../../useCases/auth/send-email.usecase";
import { VerifyExistingEmail } from "../../useCases/auth/verify-existing-email.usecase";
import { VerifyOtpUsecase } from "../../useCases/auth/verifyOtp.usecase";
import { GetClientDetailsUsecase } from "../../useCases/client/getClientDetails.usecase";
import { UpdateClientPasswordUsecase } from "../../useCases/client/update-client-password.usecase";
import { UpdateClientDetailsUsecase } from "../../useCases/client/updateClientDetails.usecase";
import { GenerateSignedUrlUsecase } from "../../useCases/common/generateSignedUrl.usecase";
import { UploadImageUsecase } from "../../useCases/common/uploadImageUsecase";
import { GetGuideProfileUsecase } from "../../useCases/guide/getGuideProfileUsecase";
import { ResetPasswordUsecase } from "../../useCases/guide/reset-password.usecase";
import { UpdateGuidePasswordUsecase } from "../../useCases/guide/updateGuidePasswordUsecase";
import { AddGuideUsecase } from "../../useCases/vendor/add-guide.usecase";
import { GetGuideDetailsUsecase } from "../../useCases/vendor/get-guide-details.usecase";
import { GetVendorDetailsUsecase } from "../../useCases/vendor/get-vendor-details.usecase";
import { GetVendorDetailsForStatusUsecase } from "../../useCases/vendor/get-vendor-detailsForStatus.usecase";
import { GetAllGuideUsecase } from "../../useCases/vendor/getAllGuides.usecase";
import { UpdateVendorPasswordUsecase } from "../../useCases/vendor/update-vendor-password.usecase";
import { UpdateVendorProfileUsecase } from "../../useCases/vendor/update-vendor-profile.usecase";
import { UpdateVendorStatusUsecase } from "../../useCases/vendor/update-vendor-status.usecase";
import { IAddPackageUsecase } from "../../entities/useCaseInterfaces/package/addPackage-usecase.interface";
import { AddPackageUsecase } from "../../useCases/package/addPackage.usecase";
import { IGetPackagesUsecase } from "../../entities/useCaseInterfaces/package/getPackages-usecase.interface";
import { GetPackageUsecase } from "../../useCases/package/getPackages.usecase";
import { IGetPackageDetailsUsecase } from "../../entities/useCaseInterfaces/package/getPackageDetails-usecase.interface";
import { GetPackageDetailsUsecase } from "../../useCases/package/getPackageDetails.usecase";
import { IUpdatePackageBasicDetailsUsecase } from "../../entities/useCaseInterfaces/package/updatePackageBasicdetails-usecase.interface";
import { UpdatePackageBasicDetailsUsecase } from "../../useCases/package/updatePackageBasicDetails.usecase";
import { IUpdateItineraryUsecase } from "../../entities/useCaseInterfaces/itinerary/updateItinerary-usecase.interface";
import { UpdateItineraryUsecase } from "../../useCases/itinerary/updateItinerary.usecase";
import { ICreateActivityUsecase } from "../../entities/useCaseInterfaces/activity/createActivity-usecase.interface";
import { CreateActivityUsecase } from "../../useCases/activity/createActivityUsecase";
import { IUpdateActivityUsecase } from "../../entities/useCaseInterfaces/activity/updateActivity-usecase.interface";
import { UpdateActivityUsecase } from "../../useCases/activity/updateActivity.usecase";
import { IDeleteActivityUsecase } from "../../entities/useCaseInterfaces/activity/deleteActivity-usecase.interface";
import { DeleteActivityUsecase } from "../../useCases/activity/deleteActivity.usecase";
import { IGetAvailablePackagesUsecase } from "../../entities/useCaseInterfaces/package/client-package/getAvailable-package-usecase.interface";
import { GetAvailbalePackagesUsecase } from "../../useCases/package/client-package/getAvailable-packages.usecase";
import { IGetPackageDetailsClientUsecase } from "../../entities/useCaseInterfaces/package/client-package/getPackageDetailsClient-usecase.interface";
import { GetPackageDetailsClientUsecase } from "../../useCases/package/client-package/getPackageDetailsClient.usecase";
import { IGetFeaturedPackagesUsecase } from "../../entities/useCaseInterfaces/package/client-package/getFeaturedPackages-usecase.interface";
import { GetFeaturedPackagesUsecase } from "../../useCases/package/client-package/getFeaturedPackages.usecase";

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

    container.register<IGetGuideProfileUsecase>('IGetGuideProfileUsecase',{
      useClass : GetGuideProfileUsecase
    })

    container.register<IUpdateGuidePasswordUsecase>('IUpdateGuidePasswordUsecase',{
      useClass : UpdateGuidePasswordUsecase
    })

    //address usecases
    container.register<IUpdateAddressUsecase>("IUpdateAddressUsecase", {
      useClass: UpdateAddressUsecase,
    });

    //package usecases
    container.register<IAddPackageUsecase>("IAddPackageUsecase",{
      useClass : AddPackageUsecase
    });

    container.register<IGetPackagesUsecase>('IGetPackagesUsecase',{
      useClass : GetPackageUsecase
    });

    container.register<IGetPackageDetailsUsecase>('IGetPackageDetailsUsecase',{
      useClass : GetPackageDetailsUsecase
    });

    container.register<IUpdatePackageBasicDetailsUsecase>('IUpdatePackageBasicDetailsUsecase',{
      useClass : UpdatePackageBasicDetailsUsecase
    });

    //client package usecase
    container.register<IGetAvailablePackagesUsecase>('IGetAvailablePackagesUsecase',{
      useClass : GetAvailbalePackagesUsecase
    });

    container.register<IGetPackageDetailsClientUsecase>('IGetPackageDetailsClientUsecase',{
      useClass : GetPackageDetailsClientUsecase
    });

    container.register<IGetFeaturedPackagesUsecase>('IGetFeaturedPackagesUsecase',{
      useClass : GetFeaturedPackagesUsecase
    })

    //itinerary usecase
    container.register<IUpdateItineraryUsecase>('IUpdateItineraryUsecase',{
      useClass : UpdateItineraryUsecase
    });

    //activity usecase
    container.register<ICreateActivityUsecase>('ICreateActivityUsecase',{
      useClass : CreateActivityUsecase
    });

    container.register<IUpdateActivityUsecase>('IUpdateActivityUsecase',{
      useClass : UpdateActivityUsecase
    });
    
    container.register<IDeleteActivityUsecase>('IDeleteActivityUsecase',{
      useClass : DeleteActivityUsecase
    });
    
    //token
    container.register<IBlackListTokenUsecase>("IBlackListTokenUsecase", {
      useClass: BlackListTokenUsecase,
    });

    container.register<IRefreshTokenUsecase>("IRefreshTokenUsecase", {
      useClass: RefreshTokenUsecase,
    });

    //image upload usecase
    container.register<IUploadImageUsecase>("IUploadImageUsecase", {
      useClass: UploadImageUsecase,
    });

    container.register<IGenerateSignedUrlUsecase>("IGenerateSignedUrlUsecase", {
      useClass: GenerateSignedUrlUsecase,
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
