import { Server, Socket } from "socket.io";

export interface IGroupChatSocketHandler {
  register(io: Server, socket: Socket): void;
}




































