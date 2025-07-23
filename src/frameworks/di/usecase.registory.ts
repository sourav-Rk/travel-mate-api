import { container } from "tsyringe";
import { IRegisterUserUsecase } from "../../entities/useCaseInterfaces/auth/registerUsecase.interface";
import { RegisterUserUsecase } from "../../useCases/auth/registerUser.useCase";
import { IVerifyOtpUsecase } from "../../entities/useCaseInterfaces/auth/verifyOtpUsecase";
import { VerifyOtpUsecase } from "../../useCases/auth/verifyOtp.usecase";
import { ILoginUsecase } from "../../entities/useCaseInterfaces/auth/loginUsecase.interface";
import { LoginUsecase } from "../../useCases/auth/login.usecase";
import { IRegisterStrategy } from "../../useCases/auth/register-strategies/register-strategy.interface";
import { ClientRegisterStrategy } from "../../useCases/auth/register-strategies/client-register.strategy";
import { ISendEmailUsecase } from "../../entities/useCaseInterfaces/auth/send-email-usecase.interface";
import { SendEmailUsecase } from "../../useCases/auth/send-email.usecase";
import { IVerifyExistingEmail } from "../../entities/useCaseInterfaces/auth/verify-existing-email-usecase.interface";
import { VerifyExistingEmail } from "../../useCases/auth/verify-existing-email.usecase";
import { ILoginStrategy } from "../../useCases/auth/login-strategies/login-strategy.interface";
import { ClientLoginStrategy } from "../../useCases/auth/login-strategies/client-login.strategy";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/auth/generate-token-usecase.interface";
import { GenerateTokenUseCase } from "../../useCases/auth/generate-token.usecase";
import { IResendOtpUsecase } from "../../entities/useCaseInterfaces/auth/resendtOtp.interface";
import { ResendOTPUsecase } from "../../useCases/auth/resendOtp.usecase";
import { ILogger } from "../../interfaceAdapters/services/logger/logger.interface";
import { WinstonLoggerAdapter } from "../../interfaceAdapters/services/logger/winston-logger.adapter";
import { LoggerMiddleware } from "../../interfaceAdapters/middlewares/logger.middleware";
import { AdminLoginStrategy } from "../../useCases/auth/login-strategies/admin-login.strategy";
import { IBlackListTokenUsecase } from "../../entities/useCaseInterfaces/auth/blacklist-token-usecase.interface";
import { BlackListTokenUsecase } from "../../useCases/auth/blacklist-token.usecase";
import { IRefreshTokenUsecase } from "../../entities/useCaseInterfaces/auth/refresh-token-usecase.interface";
import { RefreshTokenUsecase } from "../../useCases/auth/refresh-token.usecase";
import { VendorRegisteryStrategy } from "../../useCases/auth/register-strategies/vendor-register.strategy";
import { VendorLoginStrategy } from "../../useCases/auth/login-strategies/vendor-login.strategy";
import { IGetVendorDetailsForStatusUsecase } from "../../entities/useCaseInterfaces/vendor/get-vendor-details.usecase.interface";
import { GetVendorDetailsForStatusUsecase } from "../../useCases/vendor/get-vendor-detailsForStatus.usecase";
import { IAddAddressUsecase } from "../../entities/useCaseInterfaces/auth/add-address-usecase.interface";
import { AddAddressUsecase } from "../../useCases/auth/addAddress.usecase";
import { IUploadImageUsecase } from "../../entities/useCaseInterfaces/common/upload-image.usecase";
import { UploadImageUsecase } from "../../useCases/common/uploadImageUsecase";
import { IAddKycUsecase } from "../../entities/useCaseInterfaces/auth/add-kyc-usecase.interface";
import { AddKycUsecase } from "../../useCases/auth/addKyc.usecase";
import { IGetAllUsersUsecase } from "../../entities/useCaseInterfaces/admin/get-all-users-usecase.interface";
import { GetAllUsersUsecase } from "../../useCases/admin/get-all-users.usecase";
import { IUpdateUserstatusUsecase } from "../../entities/useCaseInterfaces/admin/update-user-status-usecase.interface";
import { UpdateUserStatusUsecase } from "../../useCases/admin/update-user-status.usecase";
import { IUpdateVendorStatusUsecase } from "../../entities/useCaseInterfaces/vendor/update-vendor-status.usecase.interface";
import { UpdateVendorStatusUsecase } from "../../useCases/vendor/update-vendor-status.usecase";
import { IGetUserByIdUsecase } from "../../entities/useCaseInterfaces/admin/getUserById-usecase.interface";
import { GetUserByIdUsecase } from "../../useCases/admin/getUserById.usecase";
import { IAddGuideUsecase } from "../../entities/useCaseInterfaces/vendor/add-guide-usecase.interface";
import { AddGuideUsecase } from "../../useCases/vendor/add-guide.usecase";
import { IResetPasswordUsecase } from "../../entities/useCaseInterfaces/guide/reset-password-usecase.interface";
import { ResetPasswordUsecase } from "../../useCases/guide/reset-password.usecase";
import { GuideLoginStrategy } from "../../useCases/auth/login-strategies/guide-login.strategy";
import { IGenerateSignedUrlUsecase } from "../../entities/useCaseInterfaces/common/generate-signedurl-usecase.interface";
import { GenerateSignedUrlUsecase } from "../../useCases/common/generateSignedUrl.usecase";
import { IAdminUpdateVendorStatusUsecase } from "../../entities/useCaseInterfaces/admin/update-vendor-usecase.interface";
import { AdminUpateVendorStatusUsecase } from "../../useCases/admin/update-vendor-status.usecase";
import { ClientGoogleLoginStrategy } from "../../useCases/auth/login-strategies/client-google-login.strategy";
import { IGoogleUsecase } from "../../entities/useCaseInterfaces/auth/google-usecase.interface";
import { GoogleUsecase } from "../../useCases/auth/google.usecase";
import { IGetClientDetailsUsecase } from "../../entities/useCaseInterfaces/client/getClientDetails-usecase.interface";
import { GetClientDetailsUsecase } from "../../useCases/client/getClientDetails.usecase";
import { IUpdateClientDetailsUsecase } from "../../entities/useCaseInterfaces/client/updateClientDetails-usecase.interface";
import { UpdateClientDetailsUsecase } from "../../useCases/client/updateClientDetails.usecase";
import { IForgotPasswordSendMailUsecase } from "../../entities/useCaseInterfaces/auth/forgotPassword-sendMail-usecase.interface";
import { ForgotPasswordSendMailUsecase } from "../../useCases/auth/forgotPassword-sendMail.usecase";
import { IForgotPasswordResetUsecase } from "../../entities/useCaseInterfaces/auth/forgotPassword-reset-usecase.interface";
import { ForgotPasswordResetUsecase } from "../../useCases/auth/forgotPassword-reset.usecase";
import { IUpdateClientPasswordUsecase } from "../../entities/useCaseInterfaces/client/update-client-password-usecase.interface";
import { UpdateClientPasswordUsecase } from "../../useCases/client/update-client-password.usecase";
import { IGetVendorDetailsUsecase } from "../../entities/useCaseInterfaces/vendor/get-vendor-details-usecase.interface";
import { GetVendorDetailsUsecase } from "../../useCases/vendor/get-vendor-details.usecase";
import { IUpdateVendorPasswordUsecase } from "../../entities/useCaseInterfaces/vendor/update-vendor-password-usecase.interface";
import { UpdateVendorPasswordUsecase } from "../../useCases/vendor/update-vendor-password.usecase";

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
    container.register<IGetVendorDetailsForStatusUsecase>("IGetVendorDetailsForStatusUsecase", {
      useClass: GetVendorDetailsForStatusUsecase,
    });

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

    container.register<IGetVendorDetailsUsecase>('IGetVendorDetailsUsecase',{
      useClass : GetVendorDetailsUsecase
    })

    container.register<IUpdateVendorPasswordUsecase>('IUpdateVendorPasswordUsecase',{
      useClass : UpdateVendorPasswordUsecase
    })

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
