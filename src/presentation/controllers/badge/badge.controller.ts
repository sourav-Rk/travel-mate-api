import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ICreateBadgeUsecase } from "../../../application/usecase/interfaces/badge/create-badge.interface";
import { IDeleteBadgeUsecase } from "../../../application/usecase/interfaces/badge/delete-badge.interface";
import { IEvaluateBadgesUsecase } from "../../../application/usecase/interfaces/badge/evaluate-badges.interface";
import { IGetBadgesUsecase } from "../../../application/usecase/interfaces/badge/get-badges.interface";
import { IUpdateBadgeUsecase } from "../../../application/usecase/interfaces/badge/update-badge.interface";
import { IBadgeCriteria } from "../../../domain/entities/badge.entity";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IBadgeController } from "../../interfaces/controllers/badge/badge.controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class BadgeController implements IBadgeController {
  constructor(
    @inject("IGetBadgesUsecase")
    private readonly _getBadgesUsecase: IGetBadgesUsecase,
    @inject("IEvaluateBadgesUsecase")
    private readonly _evaluateBadgesUsecase: IEvaluateBadgesUsecase,
    @inject("ICreateBadgeUsecase")
    private readonly _createBadgeUsecase: ICreateBadgeUsecase,
    @inject("IUpdateBadgeUsecase")
    private readonly _updateBadgeUsecase: IUpdateBadgeUsecase,
    @inject("IDeleteBadgeUsecase")
    private readonly _deleteBadgeUsecase: IDeleteBadgeUsecase
  ) {}

  async getAllBadges(req: Request, res: Response): Promise<void> {
    const filters = req.query;
    const result = await this._getBadgesUsecase.getAllBadges(filters);

    ResponseHelper.paginated(
      res,
      result.badges,
      result.totalPages,
      result.currentPage,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      "badges"
    );
  }

  async getGuideBadges(req: Request, res: Response): Promise<void> {
    const { guideProfileId } = req.query;

    const result = await this._getBadgesUsecase.getGuideBadges(
      String(guideProfileId)
    );

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

    const result = await this._evaluateBadgesUsecase.execute(guideProfileId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.LOCAL_GUIDE.BADGES_EVALUATED,
      result,
      "result"
    );
  }

  //------- Admin methods -------
  async createBadge(req: Request, res: Response): Promise<void> {
    //
    /**
     *Clean up criteria - remove incomplete additionalCondition objects
     */
    if (req.body.criteria && Array.isArray(req.body.criteria)) {
      req.body.criteria = req.body.criteria.map((criterion: IBadgeCriteria) => {
        if (criterion.additionalCondition) {
          const hasValidType =
            criterion.additionalCondition.type &&
            typeof criterion.additionalCondition.type === "string";
          const hasValidValue =
            criterion.additionalCondition.value !== undefined &&
            criterion.additionalCondition.value !== null &&
            typeof criterion.additionalCondition.value === "number" &&
            criterion.additionalCondition.value > 0;

          if (!hasValidType || !hasValidValue) {
            delete criterion.additionalCondition;
          }
        }
        return criterion;
      });
    }

    const adminId = (req as CustomRequest).user.id;
    const data = req.body;
    await this._createBadgeUsecase.execute(data, adminId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      SUCCESS_MESSAGE.LOCAL_GUIDE.BADGE_CREATED
    );
  }

  async updateBadge(req: Request, res: Response): Promise<void> {
    const { badgeId } = req.params;
    /**
     *Clean up criteria - remove incomplete additionalCondition objects
     */
    if (req.body.criteria && Array.isArray(req.body.criteria)) {
      req.body.criteria = req.body.criteria.map((criterion: IBadgeCriteria) => {
        if (criterion.additionalCondition) {
          const hasValidType =
            criterion.additionalCondition.type &&
            typeof criterion.additionalCondition.type === "string";
          const hasValidValue =
            criterion.additionalCondition.value !== undefined &&
            criterion.additionalCondition.value !== null &&
            typeof criterion.additionalCondition.value === "number" &&
            criterion.additionalCondition.value > 0;

          if (!hasValidType || !hasValidValue) {
            delete criterion.additionalCondition;
          }
        }
        return criterion;
      });
    }

    const data = req.body;
    const adminId = (req as CustomRequest).user?.id;

    await this._updateBadgeUsecase.execute(badgeId, data, adminId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.LOCAL_GUIDE.BADGE_UPDATED
    );
  }

  async deleteBadge(req: Request, res: Response): Promise<void> {
    const { badgeId } = req.params;

    await this._deleteBadgeUsecase.execute(badgeId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.LOCAL_GUIDE.BADGE_DISABLED
    );
  }

  async getBadgeById(req: Request, res: Response): Promise<void> {
    const { badgeId } = req.params;

    const badge = await this._getBadgesUsecase.getBadgeById(badgeId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      badge,
      "badge"
    );
  }
}
