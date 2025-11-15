export interface IUpdateVendorPasswordUsecase{
    execute(id : string,currentPassword : string, newPassword : string) : Promise<void>;
}