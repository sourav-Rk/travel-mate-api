import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGuideController } from "../../../entities/controllerInterfaces/guide/guide.controller.interface";
import { IResetPasswordUsecase } from "../../../entities/useCaseInterfaces/guide/reset-password-usecase.interface";
import { IAddGuideUsecase } from "../../../entities/useCaseInterfaces/vendor/add-guide-usecase.interface";
import { IGetGuideDetailsUsecase } from "../../../entities/useCaseInterfaces/vendor/get-guide-details-usecase.interface";
import { IGetAllGuidesUsecase } from "../../../entities/useCaseInterfaces/vendor/getAllGuides-usecase.interface";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { UserDto } from "../../../shared/dto/user.dto";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class GuideController implements IGuideController {
  constructor(
    @inject("IResetPasswordUsecase")
    private _resetPasswordResetUsecase: IResetPasswordUsecase,

    @inject("IAddGuideUsecase")
    private _addGuideUsecase: IAddGuideUsecase,

    @inject("IGetAllGuidesUsecase")
    private _getAllGuideUsecase: IGetAllGuidesUsecase,

    @inject("IGetGuideDetailsUsecase")
    private _getGuideDetailsUsecase: IGetGuideDetailsUsecase,
  ) {}

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { id, password, token } = req.body;
    await this._resetPasswordResetUsecase.execute(id, password, token);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGE.PASSWORD_UPDATE_GUIDE });
  }

  async addGuide(req: Request, res: Response): Promise<void> {
    const agencyId = (req as CustomRequest).user.id;
    const guideData = req.body as UserDto;
    await this._addGuideUsecase.execute(guideData, String(agencyId));
    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: SUCCESS_MESSAGE.ADD_GUIDE_SUCCESSFULLY });
  }

  async getAllGuides(req: Request, res: Response): Promise<void> {
    const agencyId = (req as CustomRequest).user.id;
    console.log(req.query)
    const {
      page = 1,
      limit = 10,
      searchTerm,
      status = "verified",
      languages,
      minExperience,
      maxExperience,
      gender,
    } = req.query;
    const pageNumber = Number(page);
    const pageSize = Number(limit);

    let languagesArray: string[] | undefined;
  

  if (languages) {
    if (typeof languages === "string") {
 
      if (languages.startsWith("[")) {
     
        try {
          languagesArray = JSON.parse(languages);
        } catch (error) {
          languagesArray = languages.split(",");
        }
      } else {
    
        languagesArray = languages.split(",");
      }
    } else if (Array.isArray(languages)) {
      languagesArray = languages as string[];
    }

    if (languagesArray) {
      languagesArray = languagesArray.map(lang => lang.trim()).filter(lang => lang.length > 0);
    }
  }

    const { user, total } = await this._getAllGuideUsecase.execute(
      pageNumber,
      pageSize,
      searchTerm as string,
      status as string,
      agencyId,
      languagesArray,
      minExperience ? Number(minExperience) : undefined,
      maxExperience ? Number(maxExperience) : undefined,
      gender as string
    );
    res.status(HTTP_STATUS.OK).json({
      success: true,
      users: user,
      totalPages: total,
      currentPage: pageNumber,
    });
  }

  async getGuideDetails(req: Request, res: Response): Promise<void> {
    const agencyId = (req as CustomRequest).user.id;
    const { id } = req.query;
    const guide = await this._getGuideDetailsUsecase.execute(agencyId, id);
    res.status(HTTP_STATUS.OK).json({ success: true, user: guide });
  }
  
  async assignGuide(req: Request, res: Response): Promise<void> {
      const {packageId} = req.params;
      
  }

}
