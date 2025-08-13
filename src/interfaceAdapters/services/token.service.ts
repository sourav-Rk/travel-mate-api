import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import ms from "ms";
import { injectable } from "tsyringe";

import { ITokenService } from "../../entities/serviceInterfaces/token-service.interface";
import { config } from "../../shared/config";
import { HTTP_STATUS } from "../../shared/constants";
import { CustomError } from "../../shared/utils/error/customError";


export interface JwtPayloadData {
  id: string;
  email: string;
  role: string;
  status ?: "pending" | "verified" | "rejected";
}

export type ResetTokenPayload = Pick<JwtPayloadData, "id" | "email" | "role">;


@injectable()
export class TokenService implements ITokenService {
  private _accessSecretKey: Secret;
  private _accessExpiresIn: string;
  private _refreshSecretKey: Secret;
  private _refreshExpiresIn: string;
  private _resetSecretKey : string;
  private _resetExpiresIn : string

  constructor() {
    this._accessSecretKey = config.jwt.ACCESS_SECRET_KEY;
    this._accessExpiresIn = config.jwt.ACCESS_EXPIRES_IN;
    this._refreshSecretKey = config.jwt.REFRESH_SECRET;
    this._refreshExpiresIn = config.jwt.REFRESH_EXPIRES_IN;
    this._resetExpiresIn = config.jwt.RESET_EXPIRES_IN;
    this._resetSecretKey = config.jwt.RESET_SECRET;
  }

  generateResetToken(payload: ResetTokenPayload): string {
      return jwt.sign(payload, this._resetSecretKey,{
        expiresIn : this._resetExpiresIn as ms.StringValue,
      })
  }

  generateAccessToken(payload: JwtPayloadData): string {
    return jwt.sign(payload, this._accessSecretKey, {
      expiresIn: this._accessExpiresIn as ms.StringValue,
    });
  }

  generateRefreshToken(payload: JwtPayloadData): string {
    return jwt.sign(payload, this._refreshSecretKey, {
      expiresIn: this._refreshExpiresIn as ms.StringValue,
    });
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this._accessSecretKey) as JwtPayload;
    } catch (error) {
      console.log("Access token verification failed");
      console.log(error);
      return null;
    }
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this._refreshSecretKey) as JwtPayload;
    } catch (error) {
      console.log("Refresh token verification failed");
      console.log(error);
      return null;
    }
  }

   verifyResetToken(token : string) : JwtPayload | null {
    try{
      const decoded =  jwt.verify(token, this._resetSecretKey);
      if(!decoded) throw new CustomError(HTTP_STATUS.BAD_REQUEST,"Invalid Token");
      return decoded as JwtPayload;
    }catch(error){
      console.log("reset token verification failed");
      console.log(error);
      return null
    }
  }

  decodeAcessToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      console.log("decode failed");
      console.log(error);
      return null;
    }
  }

  decodeResetToken(token : string) : JwtPayload | null{
    try{
      return jwt.decode(token) as JwtPayload;
    }catch(error) {
      console.log("decode failed");
      console.log(error);
      return null;
    }
  }
}
