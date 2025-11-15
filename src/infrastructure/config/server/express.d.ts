import { Server } from "socket.io";

declare global {
  var io : Server;
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