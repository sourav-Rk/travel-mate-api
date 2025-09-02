import { inject, injectable } from "tsyringe";
import { IVendorBookingController } from "../../../entities/controllerInterfaces/booking/vendor-booking-controller.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IGetBookingsVendorUsecase } from "../../../entities/useCaseInterfaces/booking/vendor-bookings/get-bookings-usecase.interface";
import { BOOKINGSTATUS, HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { ISendPaymentAlertUsecase } from "../../../entities/useCaseInterfaces/booking/vendor-bookings/send-payment-alert-usecase.interface";
import { IGetBookingDetailsVendorUsecase } from "../../../entities/useCaseInterfaces/booking/vendor-bookings/get-booking-details-usecase.interface";

@injectable()
export class VendorBookingController implements IVendorBookingController {
  constructor(
    @inject("IGetBookingsVendorUsecase")
    private _getBookingsVendorUsecase: IGetBookingsVendorUsecase,

    @inject('IGetBookingDetailsVendorUsecase')
    private _getBookingDetailsVendorUsecase : IGetBookingDetailsVendorUsecase,
    
    @inject('ISendPaymentAlertUsecase')
    private _sendPaymentAlertUsecase : ISendPaymentAlertUsecase
  ) {}

  async getBookings(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const { packageId } = req.params;
    const { page = 1, limit = 5, searchTerm, status } = req.query;
    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const { bookings, total,minTravelersCount } = await this._getBookingsVendorUsecase.execute(
      vendorId,
      packageId,
      searchTerm as string,
      status as BOOKINGSTATUS,
      pageNumber,
      pageSize
    );

    res
      .status(HTTP_STATUS.OK)
      .json({
        success: true,
        bookings,
        totalPages: total,
        currentPage: pageNumber,
        minTravelersCount
      });
  }

  async getBookingDetails(req: Request, res: Response): Promise<void> {
      const {bookingId} = req.params;
      const bookingDetails = await this._getBookingDetailsVendorUsecase.execute(bookingId);
      res.status(HTTP_STATUS.OK).json({success : true,bookingDetails});
   }

  async sendPaymentAlert(req: Request, res: Response): Promise<void> {
      const vendorId = (req as CustomRequest).user.id;
      const {packageId} = req.params;
      await this._sendPaymentAlertUsecase.execute(vendorId,packageId);
      res.status(HTTP_STATUS.OK).json({success : true,message : SUCCESS_MESSAGE})
  }
}
