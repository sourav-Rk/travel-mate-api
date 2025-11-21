import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IEvaluateBadgesUsecase } from "../../../application/usecase/interfaces/badge/evaluate-badges.interface";
import { IGetBadgesUsecase } from "../../../application/usecase/interfaces/badge/get-badges.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IBadgeController } from "../../interfaces/controllers/badge/badge.controller.interface";

@injectable()
export class BadgeController implements IBadgeController {
  constructor(
    @inject("IGetBadgesUsecase")
    private readonly _getBadgesUsecase: IGetBadgesUsecase,
    @inject("IEvaluateBadgesUsecase")
    private readonly _evaluateBadgesUsecase: IEvaluateBadgesUsecase
  ) {}

  async getAllBadges(req: Request, res: Response): Promise<void> {
    const badges = await this._getBadgesUsecase.getAllBadges();

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      badges,
      "data"
    );
  }

  async getGuideBadges(req: Request, res: Response): Promise<void> {
    const { guideProfileId } = req.query;

    if (!guideProfileId || typeof guideProfileId !== "string") {
      ResponseHelper.error(
        res,
        "guideProfileId is required",
        HTTP_STATUS.BAD_REQUEST
      );
      return;
    }

    const result = await this._getBadgesUsecase.getGuideBadges(guideProfileId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      result,
      "data"
    );
  }

  async evaluateBadges(req: Request, res: Response): Promise<void> {
    const { guideProfileId } = req.body;

    if (!guideProfileId || typeof guideProfileId !== "string") {
      ResponseHelper.error(
        res,
        "guideProfileId is required",
        HTTP_STATUS.BAD_REQUEST
      );
      return;
    }

    const result = await this._evaluateBadgesUsecase.execute(guideProfileId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Badges evaluated successfully",
      result,
      "result"
    );
  }
}
