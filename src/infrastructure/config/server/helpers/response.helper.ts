import { Response } from "express";
import { ApiResponse } from "../../../../application/dto/response/api-response-model";

export class ResponseHelper {
  static success<T>(
    res: Response,
    statusCode: number = 200,
    message?: string,
    payload?: T,
    key: string = "data"
  ): Response<ApiResponse> {
    const responseBody: any = { success: true, message };
    if (payload !== undefined) {
      responseBody[key] = payload;
    }
   return res.status(statusCode).json(responseBody);
  }

  static error(res: Response, message: string, statusCode: number = 500) {
    return res.status(statusCode).json({ success: false, message });
  }
}
