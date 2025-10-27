import { Expose, Transform } from "class-transformer";
import { Types } from "mongoose";

import { IMessageEntity } from "../../../domain/entities/message.entity";

export class MessageResDTO implements IMessageEntity {
  @Transform(({ obj }) => obj._id.toString())
  @Expose()
  _id!: string;

  @Transform(({ obj }) => obj.chatRoomId?.toString())
  @Expose()
  chatRoomId!: string;

  @Transform(({ obj }) => obj.senderId?.toString())
  @Expose()
  senderId!: string;

  @Expose()
  senderType!: "client" | "guide" | "vendor";

  @Transform(({ obj }) => obj.receiverId?.toString())
  @Expose()
  receiverId!: string;

  @Expose()
  recieverType!: "client" | "guide" | "vendor";

  @Expose()
  status!: "sent" | "delivered" | "read";

  @Expose()
  readAt?: Date;

  @Expose()
  message!: string;

  @Expose()
  contextType!: "vendor_client" | "guide_client" | "client_client";

  @Expose()
  contextId?: string;

  @Transform(({ obj }) => obj.deliveredTo?.map((id: Types.ObjectId) => id.toString()))
  @Expose()
  deliveredTo?: string[];

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;
}


export interface PaginatedMessagesDto{
   messages : IMessageEntity[];
}