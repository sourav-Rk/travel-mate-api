import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { IPhoneExistenceService } from "../../../../domain/service-interfaces/phone-existence-service.interface";
import { ITokenService } from "../../../../domain/service-interfaces/token-service.interface";
import { IUserExistenceService } from "../../../../domain/service-interfaces/user-existence-service.interface";
import {
  ERROR_MESSAGE,
  EVENT_EMMITER_TYPE,
  HTTP_STATUS,
  MAIL_CONTENT_PURPOSE,
} from "../../../../shared/constants";
import { eventBus } from "../../../../shared/eventBus";
import { mailContentProvider } from "../../../../shared/mailContentProvider";
import { GuideDto, UserDto } from "../../../dto/response/user.dto";
import { IAddGuideUsecase } from "../../interfaces/vendor/add-guide-usecase.interface";

@injectable()
export class AddGuideUsecase implements IAddGuideUsecase {
  constructor(
    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository,

    @inject("IUserExistenceService")
    private _userExistanceService: IUserExistenceService,

    @inject("IPhoneExistenceService")
    private _phoneExistenceService: IPhoneExistenceService,

    @inject("ITokenService")
    private _tokenService: ITokenService
  ) {}

  async execute(data: UserDto, agencyId: string): Promise<void> {
    const guideData = data as GuideDto;
    const existingEmail = await this._userExistanceService.emailExists(
      guideData.email
    );

    if (existingEmail)
      throw new CustomError(HTTP_STATUS.CONFLICT,ERROR_MESSAGE.EMAIL_EXISTS);

    const phoneExists = await this._phoneExistenceService.phoneExists(
      guideData.phone
    );

    if (phoneExists)
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        ERROR_MESSAGE.PHONE_NUMBER_EXISTS
      );

    if (guideData.alternatePhone) {
      const alternatePhoneExists =
        await this._phoneExistenceService.phoneExists(guideData.alternatePhone);
      if (alternatePhoneExists)
        throw new CustomError(
          HTTP_STATUS.CONFLICT,
          ERROR_MESSAGE.ALTERNATE_PHONE_NUMBER_EXISTS
        );
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      alternatePhone,
      role,
      dob,
      gender,
      languageSpoken,
      yearOfExperience,
      documents,
    } = guideData;

    const guide = await this._guideRepository.save({
      agencyId,
      firstName,
      lastName,
      email,
      phone,
      alternatePhone,
      role,
      dob,
      gender,
      languageSpoken,
      documents,
      yearOfExperience,
      status: "pending",
    });

    const payload = {
      id: String(guide._id),
      email: guide.email,
      role: guide.role,
    };
    const resetToken = this._tokenService.generateResetToken(payload);

    const html = mailContentProvider(
      MAIL_CONTENT_PURPOSE.GUIDE_LOGIN,
      resetToken
    );

    eventBus.emit(
      EVENT_EMMITER_TYPE.SENDMAIL,
      email,
      "Set up your guide account",
      html
    );
  }
}
