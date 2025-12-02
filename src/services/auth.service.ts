import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/user.repository";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.utils";
import { AppError } from "../utils/AppError";
import {
  RegisterUserDTO,
  LoginUserDTO,
  AuthResponse,
  UserResponse,
  RefreshTokenResponse,
} from "../types/user.types";
import { ERROR_MESSAGES, HTTP_STATUS } from "../shared/constants";

export class AuthService {
  private readonly SALT_ROUNDS = 10;
  private readonly _userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository;
  }

  async register(userData: RegisterUserDTO): Promise<AuthResponse> {
    const existingUser = await this._userRepository.existsByEmail(
      userData.email
    );
    if (existingUser) {
      throw new AppError(
        ERROR_MESSAGES.AUTHENTICATION.EMAIL_ALREADY_EXISTS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const hashedPassword = await bcrypt.hash(
      userData.password,
      this.SALT_ROUNDS
    );

    const user = await this._userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(user._id.toString(), user.email);
    const refreshToken = generateRefreshToken(user._id.toString(), user.email);

    const userResponse: UserResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      user: userResponse,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async login(credentials: LoginUserDTO): Promise<AuthResponse> {
    const user = await this._userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.AUTHENTICATION.EMAIL_NOT_EXIST,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new AppError(
        ERROR_MESSAGES.AUTHENTICATION.PASSWORD_INCORRECT,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const accessToken = generateAccessToken(user._id.toString(), user.email);
    const refreshToken = generateRefreshToken(user._id.toString(), user.email);

    const userResponse: UserResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      user: userResponse,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(refreshTokenValue: string): Promise<RefreshTokenResponse> {
    if (!refreshTokenValue) {
      throw new AppError(
        ERROR_MESSAGES.AUTHENTICATION.TOKEN_REQUIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    try {
      const decoded = verifyRefreshToken(refreshTokenValue);
      if (!decoded) {
        throw new AppError(
          ERROR_MESSAGES.AUTHENTICATION.INVALID_REFRESH_TOKEN,
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      const user = await this._userRepository.findById(decoded.userId);
      if (!user) {
        throw new AppError(
          ERROR_MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      const newAccessToken = generateAccessToken(
        user._id.toString(),
        user.email
      );

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      if ((error as Error).name === "TokenExpiredError") {
        throw new AppError(
          ERROR_MESSAGES.AUTHENTICATION.REFRESH_TOKEN_EXPIRED,
          HTTP_STATUS.UNAUTHORIZED
        );
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ERROR_MESSAGES.AUTHENTICATION.INVALID_REFRESH_TOKEN,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
  }

  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await this._userRepository.findByIdWithoutPassword(userId);
    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
