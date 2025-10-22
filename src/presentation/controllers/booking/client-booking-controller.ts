import { inject, injectable } from "tsyringe";
import { IClientBookingController } from "../../interfaces/controllers/booking/client-booking-controller.interface";
import { IApplyPackageUsecase } from "../../../application/usecase/interfaces/booking/client-booking/apply-package-usecase.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import {
  BOOKINGSTATUS,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
} from "../../../shared/constants";
import { IGetBookingsUsecase } from "../../../application/usecase/interfaces/booking/client-booking/getBookings-usecase.interface";
import { IGetBookingDetailsClientUsecase } from "../../../application/usecase/interfaces/booking/client-booking/get-booking-details-user-usecase.interface";
import { IGetClientBookingDetailsUsecase } from "../../../application/usecase/interfaces/booking/client-booking/get-booking-details-client-usecase.interface";
import { ICancellBookingUsecase } from "../../../application/usecase/interfaces/booking-cancell/cancell-booking-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";

@injectable()
export class ClientBookingController implements IClientBookingController {
  constructor(
    @inject("IApplyPackageUsecase")
    private _applyPackageUsecase: IApplyPackageUsecase,

    @inject("IGetBookingDetailsUsecase")
    private _getBookingDetailsUsecase: IGetBookingDetailsClientUsecase,

    @inject("IGetBookingsUsecase")
    private _getBookingsUsecase: IGetBookingsUsecase,

    @inject("IGetClientBookingDetailsUsecase")
    private _getClientBookingDetailsUsecase: IGetClientBookingDetailsUsecase,

    @inject("ICancellBookingUsecase")
    private _cancellBookingUsecase: ICancellBookingUsecase
  ) {}

  async applyPackage(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { packageId } = req.body;
    const response = await this._applyPackageUsecase.execute(userId, packageId);
    res.status(response.statusCode).json(response.content);
  }

  async getBookingDetailOfPackage(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { packageId } = req.params;
    const response = await this._getBookingDetailsUsecase.execute(
      userId,
      packageId
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      response,
      "bookingDetails"
    );
  }

  async getBookings(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const statuses = req.query.status
      ? (req.query.status as string).split(",")
      : [];
    const response = await this._getBookingsUsecase.execute(
      userId,
      statuses as BOOKINGSTATUS[]
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      response,
      "bookings"
    );
  }

  async getBookingDetails(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { bookingId } = req.params;
    const bookingDetails = await this._getClientBookingDetailsUsecase.execute(
      userId,
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

  async cancellBooking(req: Request, res: Response): Promise<void> {
    const { bookingId } = req.params;
    const { cancellationReason } = req.body;

    console.log(bookingId, "-->booking id cancell");
    console.log(cancellationReason, "--->reason");
    const userId = (req as CustomRequest).user.id;
    const { refundAmount } = await this._cancellBookingUsecase.execute(
      userId,
      bookingId,
      cancellationReason
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.BOOKING_CANCELLATION.CANCELLATION_REQUESTED(refundAmount)
    );
  }
}
