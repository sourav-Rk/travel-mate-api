import { IsNotEmpty, IsString } from "class-validator";

export class MarkReadNotificationReqDTO {
  @IsNotEmpty({ message: "notificationId is required" })
  @IsString({ message: "notificationId must be a string" })
  notificationId!: string;
}
