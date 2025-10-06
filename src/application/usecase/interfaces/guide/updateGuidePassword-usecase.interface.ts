export interface IUpdateGuidePasswordUsecase {
    execute(id : any,currentPassword : string, newPassword : string) : Promise<void>;
}