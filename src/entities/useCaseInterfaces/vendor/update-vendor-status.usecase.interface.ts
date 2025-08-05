export interface IUpdateVendorStatusUsecase{
    execute(vendorId : string,status : string) : Promise<void>;
}