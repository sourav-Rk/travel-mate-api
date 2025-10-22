import { injectable } from "tsyringe";
import { BaseRepository } from "../baseRepository";
import {
  chatRoomDB,
  IChatroomModel,
} from "../../database/models/chatroom.model";
import { IChatRoomEntity } from "../../../domain/entities/chatroom.entity";
import { IChatRoomRepository } from "../../../domain/repositoryInterfaces/chatroom/chatroom-repository.interface";
import mongoose, { Types } from "mongoose";
import { ChatRoomMapper } from "../../../application/mapper/chatroom.mapper";
import { ChatListResponseDTO } from "../../../application/dto/response/chatroomDto";

@injectable()
export class ChatRoomRepository
  extends BaseRepository<IChatroomModel, IChatRoomEntity>
  implements IChatRoomRepository
{
  constructor() {
    super(chatRoomDB, ChatRoomMapper.toEntity);
  }

  async findByParticipants(
    participants: { userId: string; userType: "client" | "guide" | "vendor" }[],
    contextType: "vendor_client" | "guide_client" | "client_client",
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

    const pipeline: any[] = [
      // Find all rooms where current user participates
      { $match: { "participants.userId": userObjectId ,contextType : "vendor_client"} },

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

      //  Lookup from all 3 collections separately
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

      //  Merge them all back into one array
      {
        $project: {
          all: { $concatArrays: ["$clients", "$guides", "$vendors"] },
        },
      },
      { $unwind: "$all" },
      { $replaceRoot: { newRoot: "$all" } },

      //  Get the peer info
      {
        $addFields: {
          peerInfo: { $arrayElemAt: ["$peerInfo", 0] },
        },
      },

      //Lookup last message details
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

      // Optional search
      ...(searchTerm
        ? [
            {
              $match: {
                "peerInfo.name": { $regex: searchTerm, $options: "i" },
              },
            },
          ]
        : []),

      // Sorting and pagination
      { $sort: { lastMessageAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      // S Project clean response
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
