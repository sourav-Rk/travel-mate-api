import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { sendSuccess, sendCreated } from "../utils/response.utils";
import { RegisterUserDTO, LoginUserDTO } from "../types/user.types";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  HTTP_STATUS,
} from "../shared/constants";

export class AuthController {
  private readonly _authService: AuthService;

  constructor(authService: AuthService) {
    this._authService = authService;
  }

  async register(req: Request, res: Response): Promise<void> {
    const userData: RegisterUserDTO = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const result = await this._authService.register(userData);
    sendCreated(res, SUCCESS_MESSAGES.AUTHENTICATION.REGISTER_SUCCESS);
  }

  async login(req: Request, res: Response): Promise<void> {
    const credentials: LoginUserDTO = {
      email: req.body.email,
      password: req.body.password,
    };

    const result = await this._authService.login(credentials);
    sendSuccess(res, SUCCESS_MESSAGES.AUTHENTICATION.LOGIN_SUCCESS, result);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    const result = await this._authService.refreshToken(refreshToken);
    sendSuccess(res, SUCCESS_MESSAGES.AUTHENTICATION.TOKEN_REFRESHED, result);
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.AUTHENTICATION.UNAUTHORIZED,
      });
      return;
    }

    const user = await this._authService.getCurrentUser(userId);
    sendSuccess(res, SUCCESS_MESSAGES.DETAILS_FETCHED, user);
  }
}
