import { Request, Response, NextFunction } from "express";
import { IAuthController } from "../../../entities/controllerInterfaces/auth/auth.controller.interfaces";
import { inject, injectable } from "tsyringe";
import { IRegisterUserUsecase } from "../../../entities/useCaseInterfaces/auth/registerUsecase.interface";
import { IVerifyOtpUsecase } from "../../../entities/useCaseInterfaces/auth/verifyOtpUsecase";
import { ILoginUsecase } from "../../../entities/useCaseInterfaces/auth/loginUsecase.interface";
import {
  clearCookie,
  setAuthCookies,
  updateCookieWithAccessToken,
} from "../../../shared/utils/cookieHelper";
import { LoginUserDTO, UserDto } from "../../../shared/dto/user.dto";
import { userSchemas } from "./validation/user-signup-validation.schema";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
} from "../../../shared/constants";
import { ISendEmailUsecase } from "../../../entities/useCaseInterfaces/auth/send-email-usecase.interface";
import { IOtpService } from "../../../entities/serviceInterfaces/otp-service.interface";
import { IGenerateTokenUseCase } from "../../../entities/useCaseInterfaces/auth/generate-token-usecase.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IResendOtpUsecase } from "../../../entities/useCaseInterfaces/auth/resendtOtp.interface";
import { IRefreshTokenUsecase } from "../../../entities/useCaseInterfaces/auth/refresh-token-usecase.interface";
import { IBlackListTokenUsecase } from "../../../entities/useCaseInterfaces/auth/blacklist-token-usecase.interface";
import { IGoogleUsecase } from "../../../entities/useCaseInterfaces/auth/google-usecase.interface";
import { IForgotPasswordSendMailUsecase } from "../../../entities/useCaseInterfaces/auth/forgotPassword-sendMail-usecase.interface";
import { IForgotPasswordResetUsecase } from "../../../entities/useCaseInterfaces/auth/forgotPassword-reset-usecase.interface";
import { ISendEmailOtpUsecase } from "../../../entities/useCaseInterfaces/auth/send-email-otp-usecase.interface";

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
    private _LoginUsecase: ILoginUsecase,

    @inject("IVerifyOtpUsecase")
    private _VerifyOtpUsecase: IVerifyOtpUsecase,

    @inject("IOtpService")
    private _OtpService: IOtpService,

    @inject('ISendEmailOtpUsecase')
    private _sendEmailOtpUsecase : ISendEmailOtpUsecase,

    @inject("IResendOtpUsecase")
    private _ResendOtpUsecase: IResendOtpUsecase,

    @inject("IGenerateTokenUseCase")
    private _GenerateTokenUsecase: IGenerateTokenUseCase,

    @inject("IRefreshTokenUsecase")
    private RefreshTokenUsecase: IRefreshTokenUsecase,

    @inject("IBlackListTokenUsecase")
    private BlackListTokenUsecase: IBlackListTokenUsecase,

    @inject('IForgotPasswordSendMailUsecase')
    private _forgotPasswordSendMailUsecase : IForgotPasswordSendMailUsecase,

    @inject('IForgotPasswordResetUsecase')
    private _forgotPasswordResetUsecase : IForgotPasswordResetUsecase
  ) {}

  async signup(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const formData = (await this._OtpService.getFormData(email)) as UserDto;
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
    console.log("triggerd validation");

    const response = await this._RegisterUserUsecase.execute(validateData);
    console.log("triggered register");
    res.status(response.statusCode).json(response.content);
  }

  async googleSignup(req: Request, res: Response): Promise<void> {
    const { credential, client_id, role } = req.body;
    const user = await this._googleUsecase.execute(credential, client_id, role);
    if (!user._id || !user.email || !user.role)
      throw new Error("User id, email or role is missing");

    const userId = user._id.toString();

    const tokens = await this._GenerateTokenUsecase.execute(
      userId,
      user.email,
      user.role
    );

    const accessTokenName = `${user.role}_access_token`;
    const refreshTokenName = `${user.role}_refresh_token`;

    setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
      accessTokenName,
      refreshTokenName
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

  async sendEmailOtp(req : Request, res : Response) : Promise<void> {
     const {email} = req.body;
     await this._sendEmailOtpUsecase.execute(email);
     res.status(HTTP_STATUS.OK).json({status : true,message : "Otp send successfully"})
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;
    const response = await this._VerifyOtpUsecase.execute(email, otp);
    res.status(response.statusCode).json(response.content);
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    await this._ResendOtpUsecase.execute(email);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGE.OTP_RESENT_SUCCESS });
  }

  async login(req: Request, res: Response): Promise<void> {
    const data = req.body as LoginUserDTO;

    const user = await this._LoginUsecase.execute(data);

    if (!user._id || !user.email || !user.role) {
      throw new Error("User id , email or role  is missing");
    }

    const userId = user._id.toString();

    const tokens = await this._GenerateTokenUsecase.execute(
      userId,
      user.email,
      user.role
    );

    const accessTokenName = `${user.role}_access_token`;
    const refreshTokenName = `${user.role}_refresh_token`;

    setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
      accessTokenName,
      refreshTokenName
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

  async forgotPasswordSendMail(req : Request, res : Response) : Promise<void>{
     const {email} = req.body;
     await this._forgotPasswordSendMailUsecase.execute(email);
     res.status(HTTP_STATUS.OK).json({success : true,message : SUCCESS_MESSAGE.RESET_LINK_SEND});
  }

  async forgotPasswordReset(req : Request,res:Response) : Promise<void>{
    const {token,password,confirmPassword} = req.body;
    await this._forgotPasswordResetUsecase.execute(token,password,confirmPassword);
    res.status(HTTP_STATUS.OK).json({success : true,message : "Password changed successfully!"})
  }

  async logout(req: Request, res: Response): Promise<void> {
    await this.BlackListTokenUsecase.execute(
      (req as CustomRequest).user.access_token
    );

    const user = (req as CustomRequest).user;
    const accessTokenName = `${user.role}_access_token`;
    const refreshTokenName = `${user.role}_refresh_token`;
    clearCookie(res, accessTokenName, refreshTokenName);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGE.LOGOUT_SUCCESS });
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      console.log("hit refresh token controller");
      const refreshToken = (req as CustomRequest).user.refresh_token;
      const newToken = this.RefreshTokenUsecase.execute(refreshToken);
      const accessTokenName = `${newToken.role}_access_token`;
      updateCookieWithAccessToken(res, newToken.accessToken, accessTokenName);
      console.log("success refresh token controller");
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGE.OPERATION_SUCCESS,
        token: newToken.accessToken,
      });
    } catch (error) {
      clearCookie(
        res,
        `${(req as CustomRequest).user.role}_access_token`,
        `${(req as CustomRequest).user.role}_refresh_token`
      );
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGE.INVALID_TOKEN });
    }
  }
}
