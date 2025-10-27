import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ITokenService } from "../../../../domain/service-interfaces/token-service.interface";
import { IUserExistenceService } from "../../../../domain/service-interfaces/user-existence-service.interface";
import {
  ERROR_MESSAGE,
  EVENT_EMMITER_TYPE,
  MAIL_CONTENT_PURPOSE,
} from "../../../../shared/constants";
import { eventBus } from "../../../../shared/eventBus";
import { mailContentProvider } from "../../../../shared/mailContentProvider";
import { IForgotPasswordSendMailUsecase } from "../../interfaces/auth/forgotPassword-sendMail-usecase.interface";

@injectable()
export class ForgotPasswordSendMailUsecase
  implements IForgotPasswordSendMailUsecase
{
  constructor(
    @inject("IUserExistenceService")
    private _userExistenceService: IUserExistenceService,

    @inject("ITokenService")
    private _tokenService: ITokenService
  ) {}
  async execute(email: string): Promise<void> {
    const result = await this._userExistenceService.getUserAndRoleByEmail(
      email
    );
    if (!result) throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    const { user, role } = result;

    if (!user) {
      throw new Error(ERROR_MESSAGE.USER_ID_NOT_FOUND);
    }
    const payload = { id: user._id, email, role };

    const token = this._tokenService.generateResetToken(payload);

    const html = mailContentProvider(
      MAIL_CONTENT_PURPOSE.RESET_PASSWORD,
      token
    );

    eventBus.emit(EVENT_EMMITER_TYPE.SENDMAIL, email, "Password Reset", html);
  }
}
