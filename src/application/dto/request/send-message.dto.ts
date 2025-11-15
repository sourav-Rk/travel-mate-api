import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsEnum } from "class-validator";
import { Type } from "class-transformer";

export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  FILE = "file",
  VOICE = "voice",
}

export class MediaAttachmentDto {
  @IsString()
  @IsNotEmpty()
  url!: string;

  @IsString()
  @IsNotEmpty()
  publicId!: string;

  @IsEnum(MediaType)
  type!: MediaType;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  fileSize?: number;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  duration?: number;
}

export class SendMessageReqDto {
  @IsOptional()
  @IsString()
  chatRoomId?: string;

  @IsString()
  @IsNotEmpty()
  senderId!: string;

  @IsString()
  @IsNotEmpty()
  senderType!: "client" | "guide" | "vendor";

  @IsString()
  @IsNotEmpty()
  receiverId!: string;

  @IsString()
  @IsNotEmpty()
  receiverType!: "client" | "guide" | "vendor";

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaAttachmentDto)
  mediaAttachments?: MediaAttachmentDto[];

  @IsString()
  @IsNotEmpty()
  contextType!: "vendor_client" | "guide_client" | "client_client";

  @IsOptional()
  @IsString()
  contextId?: string;
}







