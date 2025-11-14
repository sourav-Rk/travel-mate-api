import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGetPendingVerificationsUsecase } from "../../../application/usecase/interfaces/local-guide/get-pending-verifications-usecase.interface";
import { IRejectLocalGuideUsecase } from "../../../application/usecase/interfaces/local-guide/reject-local-guide-usecase.interface";
import { IRequestLocalGuideVerificationUsecase } from "../../../application/usecase/interfaces/local-guide/request-local-guide-verification-usecase.interface";
import { IVerifyLocalGuideUsecase } from "../../../application/usecase/interfaces/local-guide/verify-local-guide-usecase.interface";
import { IGetLocalGuideProfileUsecase } from "../../../application/usecase/interfaces/local-guide/get-local-guide-profile-usecase.interface";
import { IUpdateLocalGuideAvailabilityUsecase } from "../../../application/usecase/interfaces/local-guide/update-local-guide-availability-usecase.interface";
import { IUpdateLocalGuideProfileUsecase } from "../../../application/usecase/interfaces/local-guide/update-local-guide-profile-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import {
  HTTP_STATUS,
  SUCCESS_MESSAGE,
  TVerificationStatus,
  VERIFICATION_STATUS,
} from "../../../shared/constants";
import { ILocalGuideController } from "../../interfaces/controllers/local-guide/local-guide.controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class LocalGuideController implements ILocalGuideController {
  constructor(
    @inject("IRequestLocalGuideVerificationUsecase")
    private _requestVerificationUsecase: IRequestLocalGuideVerificationUsecase,
    @inject("IGetPendingVerificationsUsecase")
    private _getPendingVerificationsUsecase: IGetPendingVerificationsUsecase,
    @inject("IVerifyLocalGuideUsecase")
    private _verifyLocalGuideUsecase: IVerifyLocalGuideUsecase,
    @inject("IRejectLocalGuideUsecase")
    private _rejectLocalGuideUsecase: IRejectLocalGuideUsecase,
    @inject("IGetLocalGuideProfileUsecase")
    private _getLocalGuideProfileUsecase: IGetLocalGuideProfileUsecase,
    @inject("IUpdateLocalGuideAvailabilityUsecase")
    private _updateLocalGuideAvailabilityUsecase: IUpdateLocalGuideAvailabilityUsecase,
    @inject("IUpdateLocalGuideProfileUsecase")
    private _updateLocalGuideProfileUsecase: IUpdateLocalGuideProfileUsecase
  ) {}

  async requestVerification(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;

    // Check if this is a resubmission by checking existing profile status
    const existingProfile = await this._getLocalGuideProfileUsecase.execute(
      userId
    );
    const isResubmission = existingProfile?.verificationStatus === "rejected";

    const profile = await this._requestVerificationUsecase.execute(
      userId,
      req.body
    );

    const message = isResubmission
      ? SUCCESS_MESSAGE.LOCAL_GUIDE.VERIFICATION_RESUBMITTED
      : SUCCESS_MESSAGE.LOCAL_GUIDE.VERIFICATION_REQUESTED;

    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      message,
      profile,
      "profile"
    );
  }

  async getPendingVerifications(req: Request, res: Response): Promise<void> {
    const {
      page = 1,
      limit = 10,
      status = VERIFICATION_STATUS.PENDING,
      searchTerm,
    } = req.query;

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const statusString = status as TVerificationStatus;
    const searchTermString = searchTerm as string | undefined;

    const result = await this._getPendingVerificationsUsecase.execute(
      statusString,
      pageNumber,
      pageSize,
      searchTermString
    );

    ResponseHelper.paginated(
      res,
      result.profiles,
      result.total,
      result.currentPage,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      "profiles"
    );
  }

  async verifyGuide(req: Request, res: Response): Promise<void> {
    const { profileId } = req.params;

    const profile = await this._verifyLocalGuideUsecase.execute(profileId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.LOCAL_GUIDE.VERIFICATION_APPROVED,
      profile
    );
  }

  async rejectGuide(req: Request, res: Response): Promise<void> {
    const { profileId } = req.params;
    const { rejectionReason } = req.body;

    const profile = await this._rejectLocalGuideUsecase.execute(
      profileId,
      rejectionReason
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.LOCAL_GUIDE.VERIFICATION_REJECTED,
      profile
    );
  }

  async getLocalGuideProfile(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;

    const profile = await this._getLocalGuideProfileUsecase.execute(userId);

    if (!profile) {
      ResponseHelper.success(
        res,
        HTTP_STATUS.NOT_FOUND,
        "Local guide profile not found",
        null
      );
      return;
    }

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      profile,
      "profile"
    );
  }

  async updateAvailability(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { isAvailable, availabilityNote } = req.body;

    const profile = await this._updateLocalGuideAvailabilityUsecase.execute(
      userId,
      isAvailable,
      availabilityNote
    );

    const availability = profile.isAvailable;
    let responseMessage;

    if (availability) {
      responseMessage = SUCCESS_MESSAGE.LOCAL_GUIDE.AVAILABLE;
    } else {
      responseMessage = SUCCESS_MESSAGE.LOCAL_GUIDE.NOT_AVAILABLE;
    }

    ResponseHelper.success(res, HTTP_STATUS.OK, responseMessage);
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;

    await this._updateLocalGuideProfileUsecase.execute(userId, req.body);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.LOCAL_GUIDE.PROFILE_UPDATED
    );
  }
}
