export interface IVendorApproveCancellationUsecase{
    execute(vendorId : string,bookingId : string) : Promise<void>;
}