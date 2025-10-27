import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IHandleStripeWebHookUsecase } from "../../../application/usecase/interfaces/payment/handleStripeWebhook-usecase.interface";
import { IPayAdvanceAmountUsecase } from "../../../application/usecase/interfaces/payment/pay-advance-amount-usecase.interface";
import { IPayFullAmountUsecase } from "../../../application/usecase/interfaces/payment/pay-fullAmount-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { config } from "../../../shared/config";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IPaymentController } from "../../interfaces/controllers/payment/payment-controller.interface";

@injectable()
export class PaymentController implements IPaymentController {
  constructor(
    @inject("IPayAdvanceAmountUsecase")
    private _payAdvanceAmountUsecase: IPayAdvanceAmountUsecase,

    @inject("IPayFullAmountUsecase")
    private _payFullAmountUsecase: IPayFullAmountUsecase,

    @inject("IHandleStripeWebHookUsecase")
    private _handleStripeWebHookUsecase: IHandleStripeWebHookUsecase
  ) {}

  async payAdvanceAmount(req: Request, res: Response): Promise<void> {
    const { bookingId, amount } = req.body;
    const result = await this._payAdvanceAmountUsecase.execute(
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
    const { bookingId, amount } = req.body;
    const result = await this._payFullAmountUsecase.execute(bookingId, amount);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.CHECKOUT_SESSION_CREATED,
      { url: result.url, sessionId: result.sessionId }
    );
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    const payload = req.body;
    const signature = req.headers["stripe-signature"] as string;
    const endpointSecret = config.stripe.webhook_secret;
    await this._handleStripeWebHookUsecase.execute(
      payload,
      signature,
      endpointSecret
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.WEBHOOK_PROCESSED
    );
  }
}
