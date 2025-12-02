import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET_NAME } from "../config/s3";
import { AppError } from "../utils/AppError";
import { randomUUID } from "crypto";
import { env } from "../config/env";
import { ERROR_MESSAGES, HTTP_STATUS } from "../shared/constants";


const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface UploadResult {
  url: string;
  key: string;
}

export class S3Service {
  async uploadImage(file: Express.Multer.File): Promise<UploadResult> {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new AppError(
        ERROR_MESSAGES.MEDIA.IVALID_FILE_TYPE,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new AppError(ERROR_MESSAGES.MEDIA.EXCEED_LIMIT,HTTP_STATUS.BAD_REQUEST);
    }

    const fileExtension = file.originalname.split(".").pop();
    const key = `blog-images/${randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await s3Client.send(command);
      const url = `https://${S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
      return { url, key };
    } catch (error) {
      console.error("S3 upload error:", error);
      throw new AppError(ERROR_MESSAGES.MEDIA.FAILED_TO_UPLOAD_IMAGE, 500);
    }
  }

  async deleteImage(key: string): Promise<void> {
    if (!key) {
      return;
    }

    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    });

    try {
      await s3Client.send(command);
    } catch (error) {
      console.error("S3 delete error:", error);
    }
  }
}
