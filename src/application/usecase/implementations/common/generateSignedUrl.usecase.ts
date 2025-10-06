import { injectable } from "tsyringe";

import { IGenerateSignedUrlUsecase } from "../../interfaces/common/generate-signedurl-usecase.interface";
import { HTTP_STATUS } from "../../../../shared/constants";
import { CustomError } from "../../../../domain/errors/customError";
import { generateSignedUrl } from "../../../../shared/utils/generateSignedUrl";

@injectable()
export class GenerateSignedUrlUsecase implements IGenerateSignedUrlUsecase {
  constructor() {}
  async execute(publicId: string, expiresIn: string): Promise<string> {
    console.log("publice id", publicId);
    if (!publicId || typeof publicId !== "string") {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        "Missing or invalid public id"
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
        "Missing or invalid public ids array"
      );
    }

    for (const publicId of publicIds) {
      if (!publicId || typeof publicId !== "string") {
        throw new CustomError(HTTP_STATUS.BAD_REQUEST, "Invalid public id");
      }
    }

    const urls = await Promise.all(
      publicIds.map((publicId) => generateSignedUrl(publicId, expiresIn))
    );
    return urls;
  }
}
