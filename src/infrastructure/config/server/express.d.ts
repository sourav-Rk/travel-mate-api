declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
       accessToken: string;
       refreshToken : string;
       email ?: string;
      };
    }
  }
}

export {};