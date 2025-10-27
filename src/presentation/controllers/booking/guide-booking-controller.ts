import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGetBookingDetailsGuideUsecase } from "../../../application/usecase/interfaces/booking/guide-booking/get-booking-details-guide-usecase.interface";
import { IGetBookingsGuideUsecase } from "../../../application/usecase/interfaces/booking/guide-booking/get-bookings-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import {
  BOOKINGSTATUS,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
} from "../../../shared/constants";
import { IGuideBookingController } from "../../interfaces/controllers/booking/guide-booking-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class GuideBookingController implements IGuideBookingController {
  constructor(
    @inject("IGetBookingsGuideUsecase")
    private _getBookingsGuideUsecase: IGetBookingsGuideUsecase,

    @inject("IGetBookingDetailsGuideUsecase")
    private _getBookingDetailsGuideUsecase: IGetBookingDetailsGuideUsecase
  ) {}

  async getBookingsOfThePackage(req: Request, res: Response): Promise<void> {
    const guideId = (req as CustomRequest).user.id;
    const { packageId } = req.params;

    const { page = 1, limit = 5, searchTerm, status } = req.query;
    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const { bookings, total } = await this._getBookingsGuideUsecase.execute(
      guideId,
      packageId,
      searchTerm as string,
      status as BOOKINGSTATUS,
      pageNumber,
      pageSize
    );

    ResponseHelper.paginated(
      res,
      bookings,
      total,
      pageNumber,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      "bookings"
    );
  }

  async getBookingDetailsGuide(req: Request, res: Response): Promise<void> {
    const guideId = (req as CustomRequest).user.id;
    const { bookingId } = req.params;
    const bookingDetails = await this._getBookingDetailsGuideUsecase.execute(
      bookingId,
      guideId
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      bookingDetails,
      "bookingDetails"
    );
  }
}
