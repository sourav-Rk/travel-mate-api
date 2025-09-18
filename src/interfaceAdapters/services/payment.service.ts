import { inject, injectable } from "tsyringe";
import { IPaymentService } from "../../entities/serviceInterfaces/payment-service.interface";
import Stripe from "stripe";
import { CustomError } from "../../shared/utils/error/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class StripePaymentService implements IPaymentService {
  constructor(
    @inject("Stripe")
    private _stripe: Stripe
  ) {}

  async createCheckoutSession(
    amount: number,
    currency: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>,
    product?: { name: string; description: string; images?: string[] }
  ): Promise<{ url: string; sessionId: string }> {
    const session = await this._stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: product?.name ?? "Travel Package",
              description: product?.description,
              images: product?.images,
            },
            unit_amount: Math.floor(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      payment_method_configuration : "pmc_1S6VjTKQExz5EL0Ni95GXMpU"
    });

    if (!session.url) {
      throw new CustomError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGE.STRIPE_PAYMENT_ERROR
      );
    }

    return { sessionId: session.id, url: session.url };
  }

  async verifyWebhookSignature(
    payload: Buffer,
    signature: string,
    endpointsecret: string
  ): Promise<Stripe.Event> {
    const event = this._stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointsecret
    );
    return event;
  }
}
