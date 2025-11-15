import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGetBookingDetailsVendorUsecase } from "../../../application/usecase/interfaces/booking/vendor-bookings/get-booking-details-usecase.interface";
import { IGetBookingsVendorUsecase } from "../../../application/usecase/interfaces/booking/vendor-bookings/get-bookings-usecase.interface";
import { ISendPaymentAlertUsecase } from "../../../application/usecase/interfaces/booking/vendor-bookings/send-payment-alert-usecase.interface";
import { IGetCancellationRequests } from "../../../application/usecase/interfaces/booking-cancell/get-cancellation-requests-usecase.interface";
import { IGetCancelledBookingDetailsUsecase } from "../../../application/usecase/interfaces/booking-cancell/get-cancelled-bookingDetails-usecase.interface";
import { IVendorApproveCancellationUsecase } from "../../../application/usecase/interfaces/booking-cancell/vendor-approve-cancellation.-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import {
  BOOKINGSTATUS,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
} from "../../../shared/constants";
import { IVendorBookingController } from "../../interfaces/controllers/booking/vendor-booking-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class VendorBookingController implements IVendorBookingController {
  constructor(
    @inject("IGetBookingsVendorUsecase")
    private _getBookingsVendorUsecase: IGetBookingsVendorUsecase,

    @inject("IGetBookingDetailsVendorUsecase")
    private _getBookingDetailsVendorUsecase: IGetBookingDetailsVendorUsecase,

    @inject("ISendPaymentAlertUsecase")
    private _sendPaymentAlertUsecase: ISendPaymentAlertUsecase,

    @inject("IVendorApproveCancellationUsecase")
    private _vendorApproveCancellationUsecase: IVendorApproveCancellationUsecase,

    @inject("IGetCancellationRequests")
    private _getCancellationRequests: IGetCancellationRequests,

    @inject("IGetCancelledBookingDetailsUsecase")
    private _getCancelledBookingDetails: IGetCancelledBookingDetailsUsecase
  ) {}

  async getBookings(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const { packageId } = req.params;
    const { page = 1, limit = 5, searchTerm, status } = req.query;
    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const { bookings, total, minTravelersCount } =
      await this._getBookingsVendorUsecase.execute(
        vendorId,
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
      minTravelersCount,
    });
  }

  async getBookingDetails(req: Request, res: Response): Promise<void> {
    const { bookingId } = req.params;
    const bookingDetails = await this._getBookingDetailsVendorUsecase.execute(
      bookingId
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      bookingDetails,
      "bookingDetails"
    );
  }

  async sendPaymentAlert(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const { packageId } = req.params;
    await this._sendPaymentAlertUsecase.execute(vendorId, packageId);
    ResponseHelper.success(res, HTTP_STATUS.OK, SUCCESS_MESSAGE.PAYMENT_ALERT);
  }

  async verifyBookingCancellation(req: Request, res: Response): Promise<void> {
    const { bookingId } = req.params;
    const userId = (req as CustomRequest).user.id;
    await this._vendorApproveCancellationUsecase.execute(userId, bookingId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.BOOKING_CANCELLATION.CANCELLATION_APPROVED
    );
  }

  async getCancellationRequests(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const { searchTerm, page = 1, limit = 10, status } = req.query;
    const { bookings, total } = await this._getCancellationRequests.execute(
      vendorId,
      +page,
      +limit,
      String(searchTerm),
      status as "cancellation_requested" | "cancelled"
    );

    ResponseHelper.paginated(res, bookings, total, +page);
  }

  async getCancelledBookingDetails(req: Request, res: Response): Promise<void> {
    const { bookingId } = req.params;
    const data = await this._getCancelledBookingDetails.execute(bookingId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      data
    );
  }
}
