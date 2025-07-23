export interface IUpdateVendorPasswordUsecase{
    execute(id : any,currentPassword : string, newPassword : string) : Promise<void>;
}