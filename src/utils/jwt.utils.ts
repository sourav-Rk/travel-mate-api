import jwt, { Secret } from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload } from "../types/common.types";
import ms from "ms";

/**
 * Generates a JWT token for a user
 */
export const generateAccessToken = (userId: string, email: string): string => {
  const payload: JwtPayload = {
    userId,
    email,
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET as Secret, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as ms.StringValue,
  });
};

export const generateRefreshToken = (userId: string, email: string): string => {
  const payload: JwtPayload = {
    userId,
    email,
  };

  return jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as ms.StringValue,
  });
};

/**
 * Verifies and decodes a access token
 */
export const verifyAccessToken = (token: string): JwtPayload | null => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
};

/**
 * verifies and decodes a refresh token
 */
export const verifyRefreshToken = (token: string): JwtPayload | null => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
};

/**
 * Extracts token from Authorization header
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};
