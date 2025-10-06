import { HTTP_STATUS } from "../../shared/constants";

import { CustomError } from "./customError";

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(HTTP_STATUS.NOT_FOUND, message);
    this.name = "NotFoundError";
  }
}
