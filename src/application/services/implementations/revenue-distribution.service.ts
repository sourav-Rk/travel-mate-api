import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../domain/errors/notFoundError";
import { IBookingRepository } from "../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { IPackageRepository } from "../../../domain/repositoryInterfaces/package/package-repository.interface";
import { IWalletRepository } from "../../../domain/repositoryInterfaces/wallet/wallet-repository.interface";
import { ERROR_MESSAGE } from "../../../shared/constants";
import { IAdminPaymentService } from "../interfaces/admin-payment-service.interface";
import { IRevenueDistributionService } from "../interfaces/revenue-distribution-service.interface";
import { IVendorPaymentService } from "../interfaces/vendor-payment-service.interface";

@injectable()
export class RevenueDistributionService implements IRevenueDistributionService {
  constructor(
    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IAdminPaymentService")
    private _adminPaymentService: IAdminPaymentService,

    @inject("IVendorPaymentService")
    private _vendorPaymentService: IVendorPaymentService
  ) {}

  async execute(
    bookingId: string,
    amount: number,
    paymentType: "advance" | "full"
  ): Promise<{ success: boolean; vendorAmount: number; adminAmount: number }> {
    const adminCommission = amount * 0.1;
    const vendorAmount = amount * 0.9;

    const booking = await this._bookingRepository.findByCustomBookingId(
      bookingId
    );

    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING_NOT_FOUND);
    }

    const packageId = booking.packageId;

    const packageDetails = await this._packageRepository.findByPackageId(
      packageId
    );

    if (!packageDetails) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    const vendorId = packageDetails.agencyId;

    const vendorWallet = await this._walletRepository.findByUserId(vendorId);

    if (!vendorWallet) {
      throw new NotFoundError(ERROR_MESSAGE.WALLET_NOT_FOUND);
    }

    await this._vendorPaymentService.processPayment(
      vendorId,
      vendorAmount,
      bookingId,
      paymentType
    );
    await this._adminPaymentService.processPayment(
      adminCommission,
      bookingId,
      paymentType
    );

    return {
      success: true,
      adminAmount: adminCommission,
      vendorAmount: vendorAmount,
    };
  }
}
