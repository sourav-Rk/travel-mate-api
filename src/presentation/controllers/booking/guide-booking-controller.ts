import { inject, injectable } from "tsyringe";
import { IGuideBookingController } from "../../interfaces/controllers/booking/guide-booking-controller.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IGetBookingsGuideUsecase } from "../../../application/usecase/interfaces/booking/guide-booking/get-bookings-usecase.interface";
import { BOOKINGSTATUS, HTTP_STATUS } from "../../../shared/constants";
import { IGetBookingDetailsGuideUsecase } from "../../../application/usecase/interfaces/booking/guide-booking/get-booking-details-guide-usecase.interface";

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

    console.log(req.query);

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

    res.status(HTTP_STATUS.OK).json({
      success: true,
      bookings,
      totalPages: total,
      currentPage: pageNumber,
    });
  }

  async getBookingDetailsGuide(req: Request, res: Response): Promise<void> {
    const guideId = (req as CustomRequest).user.id;
    const { bookingId } = req.params;
    const bookingDetails = await this._getBookingDetailsGuideUsecase.execute(
      bookingId,
      guideId
    );
    res.status(HTTP_STATUS.OK).json({ success: true, bookingDetails });
  }
}
