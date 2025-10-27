import { injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { generateSignedUrl } from "../../../../shared/utils/generateSignedUrl";
import { IGenerateSignedUrlUsecase } from "../../interfaces/common/generate-signedurl-usecase.interface";

@injectable()
export class GenerateSignedUrlUsecase implements IGenerateSignedUrlUsecase {
  constructor() {}
  async execute(publicId: string, expiresIn: string): Promise<string> {
    console.log("publice id", publicId);
    if (!publicId || typeof publicId !== "string") {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.MISSING_OR_INVALID_PUBLIC_ID
      );
    }

    const url = await generateSignedUrl(publicId, +expiresIn);

    return url;
  }

  async executeMultiple(
    publicIds: string[],
    expiresIn: number
  ): Promise<string[]> {
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.MISSING_OR_INVALID_PUBLIC_ID
      );
    }

    for (const publicId of publicIds) {
      if (!publicId || typeof publicId !== "string") {
        throw new CustomError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGE.MISSING_OR_INVALID_PUBLIC_ID);
      }
    }

    const urls = await Promise.all(
      publicIds.map((publicId) => generateSignedUrl(publicId, expiresIn))
    );
    return urls;
  }
}
