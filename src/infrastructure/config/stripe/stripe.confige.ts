import Stripe from "stripe";
import { config } from "../../../shared/config";

export const stripe = new Stripe(config.stripe.secret_key!, {
  apiVersion: "2025-08-27.basil",
});
