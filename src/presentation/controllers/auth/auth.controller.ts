import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IAuthController } from "../../interfaces/controllers/auth/auth.controller.interfaces";
import { IOtpService } from "../../../domain/service-interfaces/otp-service.interface";
import { IBlackListTokenUsecase } from "../../../application/usecase/interfaces/auth/blacklist-token-usecase.interface";
import { IForgotPasswordResetUsecase } from "../../../application/usecase/interfaces/auth/forgotPassword-reset-usecase.interface";
import { IForgotPasswordSendMailUsecase } from "../../../application/usecase/interfaces/auth/forgotPassword-sendMail-usecase.interface";
import { IGenerateTokenUseCase } from "../../../application/usecase/interfaces/auth/generate-token-usecase.interface";
import { IGoogleUsecase } from "../../../application/usecase/interfaces/auth/google-usecase.interface";
import { ILoginUsecase } from "../../../application/usecase/interfaces/auth/loginUsecase.interface";
import { IRefreshTokenUsecase } from "../../../application/usecase/interfaces/auth/refresh-token-usecase.interface";
import { IRegisterUserUsecase } from "../../../application/usecase/interfaces/auth/registerUsecase.interface";
import { IResendOtpUsecase } from "../../../application/usecase/interfaces/auth/resendtOtp.interface";
import { ISendEmailOtpUsecase } from "../../../application/usecase/interfaces/auth/send-email-otp-usecase.interface";
import { ISendEmailUsecase } from "../../../application/usecase/interfaces/auth/send-email-usecase.interface";
import { IVerifyOtpUsecase } from "../../../application/usecase/interfaces/auth/verifyOtpUsecase";
import {
  COOKIES_NAMES,
  ERROR_MESSAGE,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
} from "../../../shared/constants";
import {
  LoginUserDTO,
  UserDto,
} from "../../../application/dto/response/user.dto";
import {
  clearCookie,
  setAuthCookies,
  updateCookieWithAccessToken,
} from "../../../shared/utils/cookieHelper";
import { CustomRequest } from "../../middlewares/auth.middleware";

import { userSchemas } from "./validation/user-signup-validation.schema";
import { ILogoutUsecase } from "../../../application/usecase/interfaces/auth/logout-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";

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
    private _forgotPasswordResetUsecase: IForgotPasswordResetUsecase
  ) {}

  async signup(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const formData = (await this._otpService.getFormData(email)) as UserDto;
    if (!formData) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGE.RESTART_SIGNUP,
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

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.LOGIN_SUCCESS,
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      "user"
    );
  }

  async sendEmail(req: Request, res: Response): Promise<void> {
    const formData = req.body;
    const { email, phone } = req.body;
    await this._SendEmailUsecase.execute(email, phone, formData, "signup");

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.OTP_RESENT_SUCCESS
    );
  }

  async sendEmailOtp(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    await this._sendEmailOtpUsecase.execute(email);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.OTP_SEND_SUCCESS
    );
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;
    const response = await this._verifyOtpUsecase.execute(email, otp);
    ResponseHelper.success(res, response.statusCode, response.content.message);
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    await this._resendOtpUsecase.execute(email);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.OTP_RESENT_SUCCESS
    );
  }

  async login(req: Request, res: Response): Promise<void> {
    const data = req.body as LoginUserDTO;

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
      message: SUCCESS_MESSAGE.LOGIN_SUCCESS,
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
    console.log(req.body);
    const { email } = req.body;
    await this._forgotPasswordSendMailUsecase.execute(email);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.RESET_LINK_SEND
    );
  }

  async forgotPasswordReset(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    const { token, password, confirmPassword } = req.body;
    await this._forgotPasswordResetUsecase.execute(
      token,
      password,
      confirmPassword
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.PASSWORD_CHANGED
    );
  }

  async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = (req as CustomRequest).user.refreshToken;
    const accessToken = (req as CustomRequest).user.accessToken;

    await this._blackListTokenUsecase.execute(accessToken);

    clearCookie(res, COOKIES_NAMES.ACCESS_TOKEN, COOKIES_NAMES.REFRESH_TOKEN);
    ResponseHelper.success(res, HTTP_STATUS.OK, SUCCESS_MESSAGE.LOGIN_SUCCESS);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      console.log("hit refresh token controller");
      const refreshToken = req.cookies[COOKIES_NAMES.REFRESH_TOKEN];

      if (!refreshToken) {
        ResponseHelper.error(res,ERROR_MESSAGE.TOKEN_MISSING,HTTP_STATUS.UNAUTHORIZED);
      }

      const newToken = await this._refreshTokenUsecase.execute(refreshToken);
      updateCookieWithAccessToken(
        res,
        newToken.accessToken,
        COOKIES_NAMES.ACCESS_TOKEN
      );
      console.log("success refresh token controller");
      ResponseHelper.success(res,HTTP_STATUS.OK,SUCCESS_MESSAGE.OPERATION_SUCCESS);
    } catch (error) {
      console.log(error);
      clearCookie(res, COOKIES_NAMES.ACCESS_TOKEN, COOKIES_NAMES.REFRESH_TOKEN);
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGE.INVALID_TOKEN });
        ResponseHelper.error(res,ERROR_MESSAGE.INVALID_TOKEN,HTTP_STATUS.UNAUTHORIZED)
    }
  }
}
