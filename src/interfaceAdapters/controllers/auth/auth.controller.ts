import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IAuthController } from "../../../entities/controllerInterfaces/auth/auth.controller.interfaces";
import { IOtpService } from "../../../entities/serviceInterfaces/otp-service.interface";
import { IBlackListTokenUsecase } from "../../../entities/useCaseInterfaces/auth/blacklist-token-usecase.interface";
import { IForgotPasswordResetUsecase } from "../../../entities/useCaseInterfaces/auth/forgotPassword-reset-usecase.interface";
import { IForgotPasswordSendMailUsecase } from "../../../entities/useCaseInterfaces/auth/forgotPassword-sendMail-usecase.interface";
import { IGenerateTokenUseCase } from "../../../entities/useCaseInterfaces/auth/generate-token-usecase.interface";
import { IGoogleUsecase } from "../../../entities/useCaseInterfaces/auth/google-usecase.interface";
import { ILoginUsecase } from "../../../entities/useCaseInterfaces/auth/loginUsecase.interface";
import { IRefreshTokenUsecase } from "../../../entities/useCaseInterfaces/auth/refresh-token-usecase.interface";
import { IRegisterUserUsecase } from "../../../entities/useCaseInterfaces/auth/registerUsecase.interface";
import { IResendOtpUsecase } from "../../../entities/useCaseInterfaces/auth/resendtOtp.interface";
import { ISendEmailOtpUsecase } from "../../../entities/useCaseInterfaces/auth/send-email-otp-usecase.interface";
import { ISendEmailUsecase } from "../../../entities/useCaseInterfaces/auth/send-email-usecase.interface";
import { IVerifyOtpUsecase } from "../../../entities/useCaseInterfaces/auth/verifyOtpUsecase";
import {
  COOKIES_NAMES,
  ERROR_MESSAGE,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
} from "../../../shared/constants";
import { LoginUserDTO, UserDto } from "../../../shared/dto/user.dto";
import {
  clearCookie,
  setAuthCookies,
  updateCookieWithAccessToken,
} from "../../../shared/utils/cookieHelper";
import { CustomRequest } from "../../middlewares/auth.middleware";

import { userSchemas } from "./validation/user-signup-validation.schema";
import { ILogoutUsecase } from "../../../entities/useCaseInterfaces/auth/logout-usecase.interface";
import { ResponseHelper } from "../../../frameworks/http/helpers/response.helper";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject("IRegisterUserUsecase")
    private _RegisterUserUsecase: IRegisterUserUsecase,

    @inject("IGoogleUsecase")
    private _googleUsecase: IGoogleUsecase,

    @inject("ISendEmailUsecase")
    private _SendEmailUsecase: ISendEmailUsecase,

    @inject("ILoginUsecase")
    private _loginUsecase: ILoginUsecase,

    @inject("IVerifyOtpUsecase")
    private _verifyOtpUsecase: IVerifyOtpUsecase,

    @inject("IOtpService")
    private _otpService: IOtpService,

    @inject("ISendEmailOtpUsecase")
    private _sendEmailOtpUsecase: ISendEmailOtpUsecase,

    @inject("IResendOtpUsecase")
    private _resendOtpUsecase: IResendOtpUsecase,

    @inject("IGenerateTokenUseCase")
    private _generateTokenUsecase: IGenerateTokenUseCase,

    @inject("IRefreshTokenUsecase")
    private _refreshTokenUsecase: IRefreshTokenUsecase,

    @inject("IBlackListTokenUsecase")
    private _blackListTokenUsecase: IBlackListTokenUsecase,

    @inject("IForgotPasswordSendMailUsecase")
    private _forgotPasswordSendMailUsecase: IForgotPasswordSendMailUsecase,

    @inject("IForgotPasswordResetUsecase")
    private _forgotPasswordResetUsecase: IForgotPasswordResetUsecase,

    @inject("ILogoutUsecase")
    private _logoutUsecase: ILogoutUsecase
  ) {}

  async signup(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const formData = (await this._otpService.getFormData(email)) as UserDto;
    if (!formData) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Form data expired or not found. Please restart signup",
      });
      return;
    }

    const schema = userSchemas[formData.role];
    if (!schema) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGE.INVALID_CREDENTIALS,
      });
      return;
    }
    const validateData = schema.parse(formData);
    const response = await this._RegisterUserUsecase.execute(validateData);
    res.status(response.statusCode).json(response.content);
  }

  async googleSignup(req: Request, res: Response): Promise<void> {
    const { credential, client_id, role } = req.body;
    const user = await this._googleUsecase.execute(credential, client_id, role);
    if (!user._id || !user.email || !user.role)
      throw new Error("User id, email or role is missing");

    const userId = user._id.toString();

    const tokens = await this._generateTokenUsecase.execute(
      userId,
      user.email,
      user.role
    );

    setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
      COOKIES_NAMES.ACCESS_TOKEN,
      COOKIES_NAMES.REFRESH_TOKEN
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGE.LOGIN_SUCCESS,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  }

  async sendEmail(req: Request, res: Response): Promise<void> {
    const formData = req.body;
    const { email, phone } = req.body;
    await this._SendEmailUsecase.execute(email, phone, formData, "signup");
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "Otp send successfully" });
  }

  async sendEmailOtp(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    await this._sendEmailOtpUsecase.execute(email);
    res
      .status(HTTP_STATUS.OK)
      .json({ status: true, message: "Otp send successfully" });
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;
    const response = await this._verifyOtpUsecase.execute(email, otp);
    res.status(response.statusCode).json(response.content);
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    await this._resendOtpUsecase.execute(email);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGE.OTP_RESENT_SUCCESS });
  }

  async login(req: Request, res: Response): Promise<void> {
    const data = req.body as LoginUserDTO;
    
    console.log(data);
    const user = await this._loginUsecase.execute(data);

    if (!user._id || !user.email || !user.role) {
      throw new Error("User id , email or role  is missing");
    }

    const userId = user._id.toString();

    const tokens = await this._generateTokenUsecase.execute(
      userId,
      user.email,
      user.role
    );

    setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
      COOKIES_NAMES.ACCESS_TOKEN,
      COOKIES_NAMES.REFRESH_TOKEN
    );
     

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "user logged in succesfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user?.status,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }

  async forgotPasswordSendMail(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    await this._forgotPasswordSendMailUsecase.execute(email);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGE.RESET_LINK_SEND });
  }

  async forgotPasswordReset(req: Request, res: Response): Promise<void> {
    const { token, password, confirmPassword } = req.body;
    await this._forgotPasswordResetUsecase.execute(
      token,
      password,
      confirmPassword
    );
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "Password changed successfully!" });
  }

  async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = (req as CustomRequest).user.refreshToken;
    const accessToken = (req as CustomRequest).user.accessToken;

    await this._blackListTokenUsecase.execute(
      accessToken
    );

    await this._logoutUsecase.execute(refreshToken,accessToken);

    clearCookie(res, COOKIES_NAMES.ACCESS_TOKEN, COOKIES_NAMES.REFRESH_TOKEN);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGE.LOGOUT_SUCCESS });
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      console.log("hit refresh token controller");
      const refreshToken = req.cookies[COOKIES_NAMES.REFRESH_TOKEN];
      
      if (!refreshToken) {
        res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ suceess: false, message: ERROR_MESSAGE.TOKEN_MISSING });
        return;
      }

      const newToken = await this._refreshTokenUsecase.execute(refreshToken);
      updateCookieWithAccessToken(
        res,
        newToken.accessToken,
        COOKIES_NAMES.ACCESS_TOKEN
      );
      console.log("success refresh token controller");
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGE.OPERATION_SUCCESS,
        token: newToken.accessToken,
      });
    } catch (error) {
      console.log(error);
      clearCookie(res, COOKIES_NAMES.ACCESS_TOKEN, COOKIES_NAMES.REFRESH_TOKEN);
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGE.INVALID_TOKEN });
    }
  }
}
