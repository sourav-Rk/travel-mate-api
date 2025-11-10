import { Types } from "mongoose";
import { injectable } from "tsyringe";

import { IGroupMessageEntity } from "../../../domain/entities/group-message.entity";
import { IGroupMessageRepository } from "../../../domain/repositoryInterfaces/group-chat/group-message-repository.interface";
import {
  groupMessageDB,
  IGroupMessageModel,
} from "../../database/models/group-message.model";
import { BaseRepository } from "../baseRepository";

@injectable()
export class GroupMessageRepository
  extends BaseRepository<IGroupMessageModel, IGroupMessageEntity>
  implements IGroupMessageRepository
{
  constructor() {
    super(groupMessageDB);
  }

  async findByGroup(groupChatId: string): Promise<IGroupMessageEntity[]> {
    console.log(groupChatId, "id");
    const messages = await groupMessageDB.aggregate([
      { $match: { groupChatId: new Types.ObjectId(groupChatId) } },

      { $sort: { updatedAt: -1 } },

      {
        $lookup: {
          from: "clients",
          localField: "senderId",
          foreignField: "_id",
          as: "clientInfo",
        },
      },
      {
        $lookup: {
          from: "guides",
          localField: "senderId",
          foreignField: "_id",
          as: "guideInfo",
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "senderId",
          foreignField: "_id",
          as: "vendorInfo",
        },
      },

      {
        $addFields: {
          senderInfo: {
            $cond: {
              if: { $eq: ["$senderType", "client"] },
              then: { $arrayElemAt: ["$clientInfo", 0] },
              else: {
                $cond: {
                  if: { $eq: ["$senderType", "guide"] },
                  then: { $arrayElemAt: ["$guideInfo", 0] },
                  else: { $arrayElemAt: ["$vendorInfo", 0] },
                },
              },
            },
          },
        },
      },

      {
        $addFields: {
          senderInfo: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$senderType", "client"] },
                  then: { $arrayElemAt: ["$clientInfo", 0] },
                },
                {
                  case: { $eq: ["$senderType", "guide"] },
                  then: { $arrayElemAt: ["$guideInfo", 0] },
                },
                {
                  case: { $eq: ["$senderType", "vendor"] },
                  then: { $arrayElemAt: ["$vendorInfo", 0] },
                },
              ],
              default: null,
            },
          },
        },
      },

      {
        $addFields: {
          senderName: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$senderType", "vendor"] },
                  then: { $ifNull: ["$senderInfo.agencyName", "Vendor"] },
                },
                {
                  case: {
                    $or: [
                      { $eq: ["$senderType", "client"] },
                      { $eq: ["$senderType", "guide"] },
                    ],
                  },
                  then: {
                    $trim: {
                      input: {
                        $concat: [
                          { $ifNull: ["$senderInfo.firstName", ""] },
                          " ",
                          { $ifNull: ["$senderInfo.lastName", ""] },
                        ],
                      },
                    },
                  },
                },
              ],
              default: "Unknown User",
            },
          },
        },
      },

      {
        $project: {
          _id: 1,
          groupChatId: 1,
          senderId: 1,
          senderType: 1,
          senderName: 1,
          message: 1,
          mediaAttachments: 1,
          messageType: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return messages;
  }
}
