import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { QuoteMessagePayload } from "../response/local-guide-booking.dto";

export class GuideChatContextDto {
  @IsOptional()
  @IsString()
  guideProfileId?: string;

  @IsOptional()
  @IsString()
  postId?: string;

  @IsOptional()
  @IsString()
  bookingId?: string;
}

export class GuideChatCreateDto {
  @IsString()
  @IsNotEmpty()
  travellerId!: string;

  @IsString()
  @IsNotEmpty()
  guideId!: string;

  @ValidateNested()
  @Type(() => GuideChatContextDto)
  @IsOptional()
  context?: GuideChatContextDto;
}

export class GuideMessageAttachmentDto {
  @IsString()
  @IsNotEmpty()
  url!: string;

  @IsString()
  @IsNotEmpty()
  publicId!: string;

  @IsEnum(["image", "video", "file", "voice"])
  type!: "image" | "video" | "file" | "voice";

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsNumber()
  fileSize?: number;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;
}

export class GuideSendMessageDto {
  @IsString()
  @IsNotEmpty()
  guideChatRoomId!: string;

  @IsString()
  @IsNotEmpty()
  senderId!: string;

  @IsEnum(["client", "guide"])
  senderRole!: "client" | "guide";

  @IsEnum(["text", "media", "system", "quote"])
  messageType!: "text" | "media" | "system" | "quote";

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuideMessageAttachmentDto)
  mediaAttachments?: GuideMessageAttachmentDto[];

  @IsOptional()
  metadata?: QuoteMessagePayload
}


