import { Server, Socket } from "socket.io";

export interface INotificationSocketHandler {
  register(io: Server, socket: Socket): void;
}
