import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsArray, ValidateNested } from "class-validator";

export class CreateGroupChatReqDto {
  @IsString()
  @IsNotEmpty()
  packageId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupChatMemberDto)
  members!: GroupChatMemberDto[];
}

export class GroupChatMemberDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  userType!: "client" | "guide" | "vendor";
}

export class SendGroupMessageReqDto {
  @IsString()
  @IsNotEmpty()
  groupChatId!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;
}

export class GetGroupMessagesReqDto {
  @IsString()
  @IsNotEmpty()
  groupChatId!: string;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit!: number;

  @IsOptional()
  @IsString()
  before?: string; // ISO date string
}

export class GetGroupChatByPackageReqDto {
  @IsString()
  @IsNotEmpty()
  packageId!: string;
}

