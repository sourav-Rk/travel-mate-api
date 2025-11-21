import { inject, injectable } from "tsyringe";

import { ValidationError } from "../../../domain/errors/validationError";
import { IWalletRepository } from "../../../domain/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletTransactionsRepository } from "../../../domain/repositoryInterfaces/wallet/wallet-transactions-repository.interface";
import {
  ERROR_MESSAGE,
  TRANSACTION_DESCRIPTIONS,
  TRANSACTION_TYPE,
  ROLES,
} from "../../../shared/constants";
import { ILocalGuidePaymentService } from "../interfaces/local-guide-payment-service.interface";

@injectable()
export class LocalGuidePaymentService implements ILocalGuidePaymentService {
  constructor(
    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository,

    @inject("IWalletTransactionsRepository")
    private _walletTransactionRepository: IWalletTransactionsRepository
  ) {}

  async processPayment(
    guideId: string,
    amount: number,
    bookingId: string,
    paymentType: "advance" | "full"
  ): Promise<void> {
    if (!guideId || !bookingId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    if (amount <= 0) {
      throw new ValidationError("Payment amount must be greater than zero");
    }

    // Find or create wallet for the guide
    let wallet = await this._walletRepository.findByUserId(guideId);

    if (!wallet) {
      // Auto-create wallet if it doesn't exist
      wallet = await this._walletRepository.save({
        userId: guideId,
        userType: ROLES.CLIENT, // Local guides are clients
        balance: 0,
        currency: "INR",
      });
    }

    // Calculate new balance
    const newBalance = wallet.balance + amount;

    // Update wallet balance
    await this._walletRepository.updateById(wallet._id, {
      balance: newBalance,
    });

    // Create wallet transaction record
    await this._walletTransactionRepository.save({
      walletId: wallet._id,
      type: TRANSACTION_TYPE.CREDIT,
      referenceId: bookingId,
      description:
        paymentType === "advance"
          ? TRANSACTION_DESCRIPTIONS.LOCAL_GUIDE_ADVANCE_PAYMENT(bookingId)
          : TRANSACTION_DESCRIPTIONS.LOCAL_GUIDE_FULL_PAYMENT(bookingId),
      amount,
      metadata: {
        paymentType,
        bookingId,
        bookingType: "local_guide",
        distributedAt: new Date(),
      },
    });
  }
}








