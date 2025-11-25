import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../domain/errors/notFoundError";
import { ValidationError } from "../../../domain/errors/validationError";
import { IWalletRepository } from "../../../domain/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletTransactionsRepository } from "../../../domain/repositoryInterfaces/wallet/wallet-transactions-repository.interface";
import {
  ERROR_MESSAGE,
  TRANSACTION_DESCRIPTIONS,
  TRANSACTION_TYPE,
} from "../../../shared/constants";
import { IVendorPaymentService } from "../interfaces/vendor-payment-service.interface";

@injectable()
export class VendorPaymentService implements IVendorPaymentService {
  constructor(
    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository,

    @inject("IWalletTransactionsRepository")
    private _walletTransactionRepository: IWalletTransactionsRepository
  ) {}

  async processPayment(
    vendorId: string,
    amount: number,
    bookingId: string,
    paymentType: "advance" | "full"
  ): Promise<void> {
    const wallet = await this._walletRepository.findByUserId(vendorId);

    if (!wallet) {
      throw new NotFoundError(ERROR_MESSAGE.WALLET_NOT_FOUND);
    }

    const newBalance = wallet.balance + amount;

    await this._walletRepository.updateById(wallet._id, {
      balance: newBalance,
    });

    await this._walletTransactionRepository.save({
      walletId: wallet._id,
      type: TRANSACTION_TYPE.CREDIT,
      referenceId: bookingId,
      description:
        paymentType === "advance"
          ? TRANSACTION_DESCRIPTIONS.ADVANCE_COMMISSION(bookingId)
          : TRANSACTION_DESCRIPTIONS.FULL_COMMISSION(bookingId),
      amount,
      metadata: {
        paymentType,
        bookingId,
        distributedAt: new Date(),
      },
    });
  }

  async processCancellationRefund(
    vendorId: string,
    refundAmount: number,
    bookingId: string,
  ): Promise<void> {
    const vendorDeductionAmount = refundAmount * 0.9;

    if (refundAmount <= 0) {
      throw new ValidationError(
        ERROR_MESSAGE.REFUND.REFUND_AMOUNT_GREATER_THAN_ZERO
      );
    }

    const wallet = await this._walletRepository.findByUserId(vendorId);

    if (!wallet) {
      throw new NotFoundError(ERROR_MESSAGE.WALLET_NOT_FOUND);
    }

    const newBalance = wallet.balance - vendorDeductionAmount;

    await this._walletRepository.updateById(wallet._id, {
      balance: newBalance,
    });

    await this._walletTransactionRepository.save({
      walletId: wallet._id,
      type: TRANSACTION_TYPE.DEBIT,
      amount: vendorDeductionAmount,
      referenceId: bookingId,
      description: TRANSACTION_DESCRIPTIONS.CANCELLATION_REFUND(bookingId),
    });
  }
}
