import { JwtPayload } from "jsonwebtoken";
import { ResetTokenPayload } from "../../interfaceAdapters/services/token.service";

export interface ITokenService {
  generateResetToken(payload: ResetTokenPayload): string;

  generateAccessToken(payload: {
    id: string;
    email: string;
    role: string;
    status?: string;
  }): string;

  generateRefreshToken(payload: {
    id: string;
    email: string;
    role: string;
    status?: string;
  }): string;

  verifyAccessToken(token: string): JwtPayload | null;

  verifyRefreshToken(token: string): JwtPayload | null;

  verifyResetToken(token: string): JwtPayload | null;

  decodeAcessToken(token: string): JwtPayload | null;
}
