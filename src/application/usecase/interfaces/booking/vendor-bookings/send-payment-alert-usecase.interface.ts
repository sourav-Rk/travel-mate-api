export interface ISendPaymentAlertUsecase {
    execute(vendorId : string,packageId : string) : Promise<void>;
}