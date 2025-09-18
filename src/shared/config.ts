import dotenv from "dotenv";
dotenv.config();

export const config = {
  server: {
    PORT: process.env.PORT || 5000,
  },
  database: {
    URI: process.env.DATABASEURI || "mongodb://127.0.0.1:27017/Travel-Mate",
  },
  client: {
    uri: process.env.CLIENT_URI || "",
  },
  redis: {
    URL: process.env.REDIS_URI || "",
  },
  email: {
    EMAIL: process.env.EMAIL_USER || "",
    PASSWORD: process.env.EMAIL_PASS || "",
  },
  jwt: {
    ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY || "your-secret-key",
    ACCESS_EXPIRES_IN: process.env.ACCESS_EXPIRES_IN || "your-secret-key",
    REFRESH_SECRET: process.env.REFRESH_SECRET_KEY || "",
    REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN || "",
    RESET_SECRET : process.env.RESET_SECRET_KEY || "",
    RESET_EXPIRES_IN : process.env.RESET_EXPIRES_IN || ""
  },
  cloudinary :{
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
  },
  firebase : {
    service_account_key_json : process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON || ""
  },
  stripe : {
    secret_key : process.env.STRIPE_SECRET_KEY,
    currency : "inr",
    cancel_url : `${process.env.CLIENT_URI}/cancel`,
    endpoint_secret : process.env.STRIPE_ENDPOINT_SECRET || "",
    webhook_secret : process.env.STRIPE_WEBHOOK_SECRET || ""
  }
};
