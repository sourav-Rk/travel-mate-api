export interface IUpdateGuidePasswordUsecase {
    execute(id : string,currentPassword : string, newPassword : string) : Promise<void>;
}