import { injectable } from "tsyringe";
import { ITokenService } from "../../entities/serviceInterfaces/token-service.interface";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { config } from "../../shared/config";
import ms from "ms";


export interface JwtPayloadData {
  id: string;
  email: string;
  role: string;
  status ?: "pending" | "verified" | "rejected";
}

@injectable()
export class TokenService implements ITokenService {
  private _accessSecretKey: Secret;
  private _accessExpiresIn: string;
  private _refresshSecretKey: Secret;
  private _refreshExpiresIn: string;
  private _resetExpiresIn : string;

  constructor() {
    this._accessSecretKey = config.jwt.ACCESS_SECRET_KEY;
    this._accessExpiresIn = config.jwt.ACCESS_EXPIRES_IN;
    this._refresshSecretKey = config.jwt.REFRESH_SECRET;
    this._refreshExpiresIn = config.jwt.REFRESH_EXPIRES_IN;
    this._resetExpiresIn = config.jwt.RESET_EXPIRES_IN;
  }

  generateResetToken(payload: { id: string; email: string; role: string; }): string {
      return jwt.sign(payload, this._accessSecretKey,{
        expiresIn : this._resetExpiresIn as ms.StringValue,
      })
  }

  generateAccessToken(payload: JwtPayloadData): string {
    return jwt.sign(payload, this._accessSecretKey, {
      expiresIn: this._accessExpiresIn as ms.StringValue,
    });
  }

  generateRefreshToken(payload: JwtPayloadData): string {
    return jwt.sign(payload, this._refresshSecretKey, {
      expiresIn: this._refreshExpiresIn as ms.StringValue,
    });
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this._accessSecretKey) as JwtPayload;
    } catch (error) {
      console.log("Access token verification failed");
      return null;
    }
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this._refresshSecretKey) as JwtPayload;
    } catch (error) {
      console.log("Refresh token verification failed");
      return null;
    }
  }

  verifyResetToken(token : string) : JwtPayload | null {
    try{
      return jwt.verify(token, this._accessSecretKey) as JwtPayload;
    }catch(error){
      console.log("reset token verification failed");
      return null
    }
  }

  decodeAcessToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      console.log("decode failed");
      return null;
    }
  }

  decodeResetToken(token : string) : JwtPayload | null{
    try{
      return jwt.decode(token) as JwtPayload;
    }catch(error) {
      console.log("decode failed");
      return null;
    }
  }
}
