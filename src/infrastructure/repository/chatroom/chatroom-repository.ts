import mongoose, { Types } from "mongoose";
import { PipelineStage } from "mongoose";
import { injectable } from "tsyringe";

import { ChatListResponseDTO } from "../../../application/dto/response/chatroomDto";
import { ChatRoomMapper } from "../../../application/mapper/chatroom.mapper";
import { IChatRoomEntity } from "../../../domain/entities/chatroom.entity";
import { IChatRoomRepository } from "../../../domain/repositoryInterfaces/chatroom/chatroom-repository.interface";
import { CHAT_CONTEXT_TYPE, CHAT_USERS } from "../../../shared/constants";
import {
  chatRoomDB,
  IChatroomModel,
} from "../../database/models/chatroom.model";
import { BaseRepository } from "../baseRepository";


@injectable()
export class ChatRoomRepository
  extends BaseRepository<IChatroomModel, IChatRoomEntity>
  implements IChatRoomRepository
{
  constructor() {
    super(chatRoomDB, ChatRoomMapper.toEntity);
  }

  async findByParticipants(
    participants: { userId: string; userType: CHAT_USERS }[],
    contextType: CHAT_CONTEXT_TYPE,
    contextId: string
  ): Promise<IChatRoomEntity | null> {
    const room = await chatRoomDB
      .findOne({
        contextType,
        contextId,
        participants: {
          $all: participants.map((p) => ({
            $elemMatch: {
              userId: new Types.ObjectId(p.userId),
              userType: p.userType,
            },
          })),
        },
      })
      .lean();

    return room ? ChatRoomMapper.toEntity(room) : null;
  }

  async getChatRoomsByUser(
    userId: string,
    page: number,
    limit: number,
    searchTerm?: string
  ): Promise<ChatListResponseDTO> {
    const skip = (page - 1) * limit;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          "participants.userId": userObjectId,
          contextType: "vendor_client",
        },
      },

      {
        $addFields: {
          peer: {
            $first: {
              $filter: {
                input: "$participants",
                as: "p",
                cond: { $ne: ["$$p.userId", userObjectId] },
              },
            },
          },
        },
      },

      {
        $facet: {
          clients: [
            { $match: { "peer.userType": "client" } },
            {
              $lookup: {
                from: "clients",
                localField: "peer.userId",
                foreignField: "_id",
                as: "peerInfo",
              },
            },
          ],
          guides: [
            { $match: { "peer.userType": "guide" } },
            {
              $lookup: {
                from: "guides",
                localField: "peer.userId",
                foreignField: "_id",
                as: "peerInfo",
              },
            },
          ],
          vendors: [
            { $match: { "peer.userType": "vendor" } },
            {
              $lookup: {
                from: "vendors",
                localField: "peer.userId",
                foreignField: "_id",
                as: "peerInfo",
              },
            },
          ],
        },
      },

      {
        $project: {
          all: { $concatArrays: ["$clients", "$guides", "$vendors"] },
        },
      },
      { $unwind: "$all" },
      { $replaceRoot: { newRoot: "$all" } },

      {
        $addFields: {
          peerInfo: { $arrayElemAt: ["$peerInfo", 0] },
        },
      },

      {
        $lookup: {
          from: "messages",
          let: { roomId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$chatRoomId", "$$roomId"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
          ],
          as: "lastMessageInfo",
        },
      },
      {
        $addFields: {
          lastMessageInfo: { $arrayElemAt: ["$lastMessageInfo", 0] },
        },
      },

      ...(searchTerm
        ? [
            {
              $match: {
                "peerInfo.name": { $regex: searchTerm, $options: "i" },
              },
            },
          ]
        : []),

      { $sort: { lastMessageAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          roomId: "$_id",
          "peer.userId": 1,
          "peer.userType": 1,
          "peerInfo.firstName": 1,
          "peerInfo.profileImage": 1,
          contextType: 1,
          contextId: 1,
          lastMessage: "$lastMessageInfo.message",
          lastMessageStatus: "$lastMessageInfo.status",
          lastMessageReadAt: "$lastMessageInfo.readAt",
          lastMessageAt: "$lastMessageInfo.createdAt",
        },
      },
    ];

    const chats = await chatRoomDB.aggregate(pipeline);
    return { chats };
  }
}
