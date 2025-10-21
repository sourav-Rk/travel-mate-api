import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../domain/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletTransactionsRepository } from "../../domain/repositoryInterfaces/wallet/wallet-transactions-repository.interface";
import { NotFoundError } from "../../domain/errors/notFoundError";
import {
  ERROR_MESSAGE,
  TRANSACTION_DESCRIPTIONS,
  TRANSACTION_TYPE,
} from "../../shared/constants";
import { config } from "../../shared/config";
import { IAdminPaymentService } from "../../domain/service-interfaces/admin-payment-service.interface";
import { ValidationError } from "../../domain/errors/validationError";

@injectable()
export class AdminPaymentService implements IAdminPaymentService {
  private readonly ADMIN_USER_ID = config.admin.adminId;
  constructor(
    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository,

    @inject("IWalletTransactionsRepository")
    private _walletTransactionRepository: IWalletTransactionsRepository
  ) {}

  async processPayment(
    amount: number,
    bookingId: string,
    paymentType: "advance" | "full"
  ): Promise<void> {
    const wallet = await this._walletRepository.findByUserId(
      this.ADMIN_USER_ID!
    );

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
    refundAmount: number,
    bookingId: string,
    cancellationReason: string
  ): Promise<void> {
    if (refundAmount <= 0) {
      throw new ValidationError(
        ERROR_MESSAGE.REFUND.REFUND_AMOUNT_GREATER_THAN_ZERO
      );
    }

    const amdinDeductionAmount = refundAmount * 0.1;

    const wallet = await this._walletRepository.findByUserId(
      this.ADMIN_USER_ID!
    );

    if (!wallet) {
      throw new NotFoundError(ERROR_MESSAGE.WALLET_NOT_FOUND);
    }

    const newBalance = wallet.balance - amdinDeductionAmount;

    await this._walletRepository.updateById(wallet._id, {
      balance: newBalance,
    });

    await this._walletTransactionRepository.save({
      walletId: wallet._id,
      type: TRANSACTION_TYPE.DEBIT,
      amount: amdinDeductionAmount,
      referenceId: bookingId,
      description: TRANSACTION_DESCRIPTIONS.CANCELLATION_REFUND(bookingId),
      metadata: [cancellationReason, bookingId],
    });
  }
}
