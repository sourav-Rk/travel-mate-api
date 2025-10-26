import { Expose, Transform, Type } from "class-transformer";

export interface GroupChatMember {
  userId: string;
  userType: "client" | "guide" | "vendor";
}

export interface GroupChatDTO {
  _id: string;
  packageId: string;
  name: string;
  members: GroupChatMember[];
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class GroupChatResDTO implements GroupChatDTO {
  @Transform(({ obj }) => obj._id.toString())
  @Expose()
  _id!: string;

  @Transform(({ obj }) => obj.packageId?.toString())
  @Expose()
  packageId!: string;

  @Expose()
  name!: string;

  @Type(() => Object)
  @Expose()
  members!: GroupChatMember[];

  @Expose()
  lastMessage?: string;

  @Expose()
  lastMessageAt?: Date;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}

export interface CreateGroupChatDTO {
  packageId: string;
  name: string;
  members: GroupChatMember[];
}

export interface GroupChatListDTO {
  groupChats: GroupChatDTO[];
  total: number;
}

export interface MemberDetailDto {
  userId: string;
  userType: "client" | "guide" | "vendor";
  name: string;
  avatar?: string;
}

export interface GroupChatDetailsQueryDto {
  _id: string;
  packageId: string;
  name: string;
  members: Array<{
    userId: string;
    userType: "client" | "guide" | "vendor";
  }>;
  memberDetails: MemberDetailDto[];
  membersCount: number;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupChatDetailsDto {
  _id: string;
  packageId: string;
  name: string;
  memberDetails: MemberDetailDto[];
  membersCount: number;
  createdAt: Date;
}
