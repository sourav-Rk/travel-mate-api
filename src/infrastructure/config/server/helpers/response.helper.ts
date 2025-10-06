import { Response } from "express";
import { ApiResponse } from "../../../../application/dto/response/api-response-model";

export class ResponseHelper {
  static success<T>(
    res: Response,
    statusCode: number = 200,
    message?: string,
    data?: T
  ): Response<ApiResponse> {
    return res.status(statusCode).json({ success: true, message, data });
  }

  static error(res: Response, message: string, statusCode: number = 500) {
    return res.status(statusCode).json({ success: false, message });
  }
}
