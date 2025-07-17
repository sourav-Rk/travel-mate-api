export interface IPhoneExistenceService{
    phoneExists(phone : string) : Promise<boolean>;
}