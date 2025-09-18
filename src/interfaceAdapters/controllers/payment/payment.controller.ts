import { inject, injectable } from "tsyringe";
import { IPaymentController } from "../../../entities/controllerInterfaces/payment/payment-controller.interface";
import { Request, Response } from "express";
import { IPayAdvanceAmountUsecase } from "../../../entities/useCaseInterfaces/payment/pay-advance-amount-usecase.interface";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IHandleStripeWebHookUsecase } from "../../../entities/useCaseInterfaces/payment/handleStripeWebhook-usecase.interface";
import { config } from "../../../shared/config";
import { IPayFullAmountUsecase } from "../../../entities/useCaseInterfaces/payment/pay-fullAmount-usecase.interface";

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
    res
      .status(HTTP_STATUS.OK)
      .json({
        success: true,
        message: SUCCESS_MESSAGE.CHECKOUT_SESSION_CREATED,
        data: { url: result.url, sessionId: result.sessionId },
      });
  }

  async payFullAmount(req: Request, res: Response): Promise<void> {
    console.log(req.body)
    const { bookingId, amount } = req.body;
    const result = await this._payFullAmountUsecase.execute(bookingId, amount);
    res
      .status(HTTP_STATUS.OK)
      .json({
        success: true,
        message: SUCCESS_MESSAGE.CHECKOUT_SESSION_CREATED,
        data: { url: result.url, sessionId: result.sessionId },
      });
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    console.log(req.body, "web hook controller");
    const payload = req.body;
    const signature = req.headers["stripe-signature"] as string;
    const endpointSecret = config.stripe.webhook_secret;
    await this._handleStripeWebHookUsecase.execute(
      payload,
      signature,
      endpointSecret
    );
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGE.WEBHOOK_PROCESSED });
  }
}
