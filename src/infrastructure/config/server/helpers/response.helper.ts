// import { Response } from "express";

// type BaseSuccess = {
//   success: true;
//   message?: string;
// };

// type SuccessResponse<T> = BaseSuccess & {
//   [key: string]: T | string | boolean | number | undefined;
// };

// type PaginatedSuccessResponse<T> = BaseSuccess & {
//   data: T;
//   currentPage: number;
//   totalPages: number;
// };

// type ErrorResponse = {
//   success: false;
//   message: string;
// };


// export class ResponseHelper {
//   static success<T>(
//     res: Response,
//     statusCode: number = 200,
//     message?: string,
//     payload?: T,
//     key: string = "data"
//   ): Response<SuccessResponse<T>> {
//     const responseBody = {
//       success: true as const,
//       message,
//       ...(payload !== undefined ? { [key]: payload } : {}),
//     };

//     return res.status(statusCode).json(responseBody);
//   }

//   static paginated<T>(
//     res: Response,
//     data: T,
//     totalPages: number,
//     currentPage: number,
//     message?: string,
//     dataKey: string = "data"
//   ): Response<PaginatedSuccessResponse<T>> {
//     const responseBody: PaginatedSuccessResponse<T> = {
//       success: true,
//       message,
//       data,
//       currentPage,
//       totalPages,
//     };

//     return res.status(200).json(responseBody);
//   }

//   static error(
//     res: Response,
//     message: string,
//     statusCode: number = 500
//   ): Response<ErrorResponse> {
//     const responseBody: ErrorResponse = {
//       success: false,
//       message,
//     };

//     return res.status(statusCode).json(responseBody);
//   }
// }


import { Response } from "express";

import { ApiResponse } from "../../../../application/dto/response/api-response-model";

type SuccessResponse<T = unknown> = {
  success: true;
  message?: string;
} & (T extends undefined ? {} : { data: T });

type PaginatedSuccessResponse<T = unknown> = {
  success: true;
  message?: string;
  data: T;
  currentPage: number;
  totalPages: number;
};

type ErrorResponse = {
  success: false;
  message: string;
};

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

  static paginated<T>(
    res: Response,
    data: T,
    totalPages: number,
    currentPage: number,
    message?: string,
    dataKey: string = "data"
  ): Response<ApiResponse> {
    const responseBody: any = {
      success: true,
      [dataKey]: data,
      currentPage,
      totalPages,
    };

    if (message) {
      responseBody.message = message;
    }

    return res.status(200).json(responseBody);
  }

  static error(res: Response, message: string, statusCode: number = 500) {
    return res.status(statusCode).json({ success: false, message });
  }
}