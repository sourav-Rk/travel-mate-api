import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGetPendingQuotesUsecase } from "../../../application/usecase/interfaces/guide-chat/get-pending-quotes.interface";
import { IAcceptQuoteUsecase } from "../../../application/usecase/interfaces/local-guide-booking/accept-quote.interface";
import { ICreateQuoteUsecase } from "../../../application/usecase/interfaces/local-guide-booking/create-quote.interface";
import { IDeclineQuoteUsecase } from "../../../application/usecase/interfaces/local-guide-booking/decline-quote.interface";
import { IGetLocalGuideBookingDetailsUsecase } from "../../../application/usecase/interfaces/local-guide-booking/get-booking-details.interface";
import { IGetLocalGuideBookingsUsecase } from "../../../application/usecase/interfaces/local-guide-booking/get-bookings.interface";
import { IGetLocalGuideBookingsForGuideUsecase } from "../../../application/usecase/interfaces/local-guide-booking/get-guide-bookings.interface";
import { IMarkServiceCompleteUsecase } from "../../../application/usecase/interfaces/local-guide-booking/mark-service-complete.interface";
import { IPayLocalGuideAdvanceAmountUsecase } from "../../../application/usecase/interfaces/local-guide-booking/pay-advance-amount.interface";
import { IPayLocalGuideFullAmountUsecase } from "../../../application/usecase/interfaces/local-guide-booking/pay-full-amount.interface";
import { ValidationError } from "../../../domain/errors/validationError";
import { IClientRepository } from "../../../domain/repositoryInterfaces/client/client.repository.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
  LocalGuideBookingStatus,
  LocalGuidePaymentFilter,
  LocalGuideBookingCategory,
} from "../../../shared/constants";
import { ILocalGuideBookingController } from "../../interfaces/controllers/local-guide-booking/local-guide-booking.controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class LocalGuideBookingController
  implements ILocalGuideBookingController
{
  constructor(
    @inject("ICreateQuoteUsecase")
    private readonly _createQuoteUsecase: ICreateQuoteUsecase,
    @inject("IGetPendingQuotesUsecase")
    private readonly _getPendingQuotesUsecase: IGetPendingQuotesUsecase,
    @inject("IAcceptQuoteUsecase")
    private readonly _acceptQuoteUsecase: IAcceptQuoteUsecase,
    @inject("IDeclineQuoteUsecase")
    private readonly _declineQuoteUsecase: IDeclineQuoteUsecase,
    @inject("IPayLocalGuideAdvanceAmountUsecase")
    private readonly _payAdvanceAmountUsecase: IPayLocalGuideAdvanceAmountUsecase,
    @inject("IPayLocalGuideFullAmountUsecase")
    private readonly _payFullAmountUsecase: IPayLocalGuideFullAmountUsecase,
    @inject("IGetLocalGuideBookingsUsecase")
    private readonly _getLocalGuideBookingsUsecase: IGetLocalGuideBookingsUsecase,
    @inject("IGetLocalGuideBookingsForGuideUsecase")
    private readonly _getLocalGuideBookingsForGuideUsecase: IGetLocalGuideBookingsForGuideUsecase,
    @inject("IClientRepository")
    private readonly clientRepository: IClientRepository,
    @inject("IGetLocalGuideBookingDetailsUsecase")
    private readonly _getLocalGuideBookingDetailsUsecase: IGetLocalGuideBookingDetailsUsecase,
    @inject("IMarkServiceCompleteUsecase")
    private readonly _markServiceCompleteUsecase: IMarkServiceCompleteUsecase
  ) {}

  async createQuote(req: Request, res: Response): Promise<void> {
    const quoteData = req.body;
    const userId = (req as CustomRequest).user.id;
    const quote = await this._createQuoteUsecase.execute(quoteData, userId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      SUCCESS_MESSAGE.LOCAL_GUIDE.QUOTE_CREATED,
      quote,
      "quote"
    );
  }

  async getPendingQuotes(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const quotes = await this._getPendingQuotesUsecase.execute(userId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      quotes,
      "quotes"
    );
  }

  async payAdvanceAmount(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { bookingId } = req.params;
    const { amount } = req.body;
    if (!bookingId || !amount) {
      throw new ValidationError(
        ERROR_MESSAGE.LOCAL_GUIDE_BOOKING.BOOKING_ID_AND_AMOUNT_REQUIRED
      );
    }

    const result = await this._payAdvanceAmountUsecase.execute(
      userId,
      bookingId,
      amount
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.CHECKOUT_SESSION_CREATED,
      { url: result.url, sessionId: result.sessionId }
    );
  }

  async payFullAmount(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { bookingId } = req.params;
    const { amount } = req.body;
    if (!bookingId || !amount) {
      throw new ValidationError(
        ERROR_MESSAGE.LOCAL_GUIDE_BOOKING.BOOKING_ID_AND_AMOUNT_REQUIRED
      );
    }

    const result = await this._payFullAmountUsecase.execute(
      userId,
      bookingId,
      amount
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.CHECKOUT_SESSION_CREATED,
      { url: result.url, sessionId: result.sessionId }
    );
  }

  async acceptQuote(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const userId = (req as CustomRequest).user.id;
    const booking = await this._acceptQuoteUsecase.execute(data, userId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      SUCCESS_MESSAGE.LOCAL_GUIDE_BOOKING.QUOTE_ACCEPTED,
      booking,
      "booking"
    );
  }

  async declineQuote(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const userId = (req as CustomRequest).user.id;
    await this._declineQuoteUsecase.execute(data, userId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.OPERATION_SUCCESS,
      null,
      "message"
    );
  }

  async getLocalGuideBookings(req: Request, res: Response): Promise<void> {
    const travellerId = (req as CustomRequest).user.id;
    const category: LocalGuideBookingCategory =
      req.query.category === "completed" ? "completed" : "pending";
    const status = req.query.status
      ? (String(req.query.status) as LocalGuideBookingStatus)
      : undefined;
    const paymentStatus = req.query.paymentStatus
      ? (String(req.query.paymentStatus) as LocalGuidePaymentFilter)
      : undefined;

    const filters = {
      category,
      status,
      paymentStatus,
      search: req.query.search ? String(req.query.search) : undefined,
      from: req.query.from ? String(req.query.from) : undefined,
      to: req.query.to ? String(req.query.to) : undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    };

    const data = await this._getLocalGuideBookingsUsecase.execute(
      travellerId,
      filters
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      data
    );
  }

  async getLocalGuideBookingsForGuide(
    req: Request,
    res: Response
  ): Promise<void> {
    const clientId = (req as CustomRequest).user.id;

    const category: LocalGuideBookingCategory =
      req.query.category === "completed" ? "completed" : "pending";
    const status = req.query.status
      ? (String(req.query.status) as LocalGuideBookingStatus)
      : undefined;
    const paymentStatus = req.query.paymentStatus
      ? (String(req.query.paymentStatus) as LocalGuidePaymentFilter)
      : undefined;

    const filters = {
      category,
      status,
      paymentStatus,
      search: req.query.search ? String(req.query.search) : undefined,
      from: req.query.from ? String(req.query.from) : undefined,
      to: req.query.to ? String(req.query.to) : undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    };

    const data = await this._getLocalGuideBookingsForGuideUsecase.execute(
      clientId,
      filters
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      data
    );
  }

  async getLocalGuideBookingDetails(
    req: Request,
    res: Response
  ): Promise<void> {
    const bookingId = req.params.bookingId;
    const userId = (req as CustomRequest).user.id;

    if (!bookingId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const booking = await this._getLocalGuideBookingDetailsUsecase.execute(
      bookingId,
      userId
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      booking,
      "booking"
    );
  }

  async markServiceComplete(req: Request, res: Response): Promise<void> {
    const bookingId = req.params.bookingId;
    const travellerId = (req as CustomRequest).user.id;

    if (!bookingId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const { notes, rating } = req.body as { notes?: string; rating?: number };

    const booking = await this._markServiceCompleteUsecase.execute(
      bookingId,
      travellerId,
      notes,
      rating
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.LOCAL_GUIDE.SERVICE_MARKED_COMPLETE,
      booking,
      "booking"
    );
  }
}









