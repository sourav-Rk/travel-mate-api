import { injectable } from "tsyringe";
import { BaseRepository } from "../baseRepository";
import {
  groupChatDB,
  IGroupChatModel,
} from "../../database/models/group-chat.model";
import { IGroupChatEntity } from "../../../domain/entities/group-chat.entity";
import { IGroupChatRepository } from "../../../domain/repositoryInterfaces/group-chat/group-chat-repository.interface";
import { GroupChatMapper } from "../../../application/mapper/group-chat.mapper";
import { FilterQuery, Types } from "mongoose";
import { GroupChatDetailsQueryDto } from "../../../application/dto/response/groupChatDto";

@injectable()
export class GroupChatRepository
  extends BaseRepository<IGroupChatModel, IGroupChatEntity>
  implements IGroupChatRepository
{
  constructor() {
    super(groupChatDB);
  }

  async findByPackage(packageId: string): Promise<IGroupChatEntity | null> {
    return await groupChatDB.findOne({ packageId });
  }

  async addMember(
    groupId: string,
    member: { userId: string; userType: "client" | "vendor" | "guide" }
  ): Promise<void> {
    await groupChatDB.findByIdAndUpdate(
      groupId,
      {
        $addToSet: {
          members: {
            userId: member.userId,
            userType: member.userType,
          },
        },
      },
      { new: true }
    );
  }

  async findByUserId(userId: string,searchTerm?:string): Promise<IGroupChatEntity[]> {

    let filter :FilterQuery<IGroupChatModel>  = {"members.userId":userId};

    if(searchTerm){
        filter.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const groups = await groupChatDB
      .find({ "members.userId": userId })
      .sort({ updatedAt: -1 });
    return groups.map((group) => GroupChatMapper.toEntity(group));
  }

  async getGroupWithMemberDetails(groupChatId: string): Promise<GroupChatDetailsQueryDto> {
    const groups = await groupChatDB.aggregate([

      { $match: { _id: new Types.ObjectId(groupChatId) } },

      {
        $lookup: {
          from: "clients",
          localField: "members.userId",
          foreignField: "_id",
          as: "clientMembers",
        },
      },
      {
        $lookup: {
          from: "guides",
          localField: "members.userId",
          foreignField: "_id",
          as: "guideMembers",
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "members.userId",
          foreignField: "_id",
          as: "vendorMembers",
        },
      },

      {
        $addFields: {
          memberDetails: {
            $map: {
              input: "$members",
              as: "member",
              in: {
                $let: {
                  vars: {
                    client: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$clientMembers",
                            as: "client",
                            cond: { $eq: ["$$client._id", "$$member.userId"] },
                          },
                        },
                        0,
                      ],
                    },
                    guide: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$guideMembers",
                            as: "guide",
                            cond: { $eq: ["$$guide._id", "$$member.userId"] },
                          },
                        },
                        0,
                      ],
                    },
                    vendor: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$vendorMembers",
                            as: "vendor",
                            cond: { $eq: ["$$vendor._id", "$$member.userId"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: {
                    userId: "$$member.userId",
                    userType: "$$member.userType",
                    name: {
                      $switch: {
                        branches: [
                          {
                            case: { $eq: ["$$member.userType", "client"] },
                            then: {
                              $concat: [
                                { $ifNull: ["$$client.firstName", ""] },
                                " ",
                                { $ifNull: ["$$client.lastName", ""] },
                              ],
                            },
                          },
                          {
                            case: { $eq: ["$$member.userType", "guide"] },
                            then: {
                              $concat: [
                                { $ifNull: ["$$guide.firstName", ""] },
                                " ",
                                { $ifNull: ["$$guide.lastName", ""] },
                              ],
                            },
                          },
                          {
                            case: { $eq: ["$$member.userType", "vendor"] },
                            then: {
                              $ifNull: ["$$vendor.agencyName", "Vendor"],
                            },
                          },
                        ],
                        default: "Unknown User",
                      },
                    },
                    avatar: {
                      $switch: {
                        branches: [
                          {
                            case: { $eq: ["$$member.userType", "client"] },
                            then: "$$client.profileImage",
                          },
                          {
                            case: { $eq: ["$$member.userType", "guide"] },
                            then: "$$guide.profileImage",
                          },
                          {
                            case: { $eq: ["$$member.userType", "vendor"] },
                            then: "$$vendor.profileImage",
                          },
                        ],
                        default: null,
                      },
                    },
                  },
                },
              },
            },
          },
          membersCount: { $size: "$members" },
        },
      },

      {
        $project: {
          _id: 1,
          packageId: 1,
          name: 1,
          members: 1,
          memberDetails: 1,
          membersCount: 1,
          lastMessage: 1,
          lastMessageAt: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return groups[0] ;
  }
}
