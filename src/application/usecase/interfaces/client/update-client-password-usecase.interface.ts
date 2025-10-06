export interface IUpdateClientPasswordUsecase {
    execute(id : any,currentPassword : string, newPassword : string) : Promise<void>;
}