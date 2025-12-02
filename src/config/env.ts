import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: number;
  MONGODB_URI: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  AWS_BUCKET_NAME: string;
  NODE_ENV: string;
}

const getEnvConfig = (): EnvConfig => {
  const config: EnvConfig = {
    PORT: parseInt(process.env.PORT || "5000"),
    MONGODB_URI: process.env.MONGODB_URI || "",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    AWS_REGION: process.env.AWS_REGION || "us-east-1",
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || "",
    NODE_ENV: process.env.NODE_ENV || "development",
  };

  if (!config.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is missing in .env");
  }
  if (!config.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is missing in .env");
  }

  return config;
};

export const env = getEnvConfig();
