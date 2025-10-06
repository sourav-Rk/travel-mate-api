import { inject, injectable } from "tsyringe";

import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { IPhoneExistenceService } from "../../../../domain/service-interfaces/phone-existence-service.interface";
import { ITokenService } from "../../../../domain/service-interfaces/token-service.interface";
import { IUserExistenceService } from "../../../../domain/service-interfaces/user-existence-service.interface";
import { IAddGuideUsecase } from "../../interfaces/vendor/add-guide-usecase.interface";
import {
  EVENT_EMMITER_TYPE,
  HTTP_STATUS,
  MAIL_CONTENT_PURPOSE,
} from "../../../../shared/constants";
import { GuideDto, UserDto } from "../../../dto/response/user.dto";
import { eventBus } from "../../../../shared/eventBus";
import { mailContentProvider } from "../../../../shared/mailContentProvider";
import { CustomError } from "../../../../domain/errors/customError";

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
      throw new CustomError(HTTP_STATUS.CONFLICT, "Email already exists");

    const phoneExists = await this._phoneExistenceService.phoneExists(
      guideData.phone
    );

    if (phoneExists)
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        "phone number already exists"
      );

    if (guideData.alternatePhone) {
      const alternatePhoneExists =
        await this._phoneExistenceService.phoneExists(guideData.alternatePhone);
      if (alternatePhoneExists)
        throw new CustomError(
          HTTP_STATUS.CONFLICT,
          "alternate phone number already exists"
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
