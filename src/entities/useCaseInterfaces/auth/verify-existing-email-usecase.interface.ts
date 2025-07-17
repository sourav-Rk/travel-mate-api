export interface IVerifyExistingEmail{
    execute(email : string) : Promise<void>;
}