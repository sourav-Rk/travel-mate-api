export interface IUpdateClientPasswordUsecase {
    execute(id : string,currentPassword : string, newPassword : string) : Promise<void>;
}