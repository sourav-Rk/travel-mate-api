export interface IUserExistenceService{
    emailExists(email : string) : Promise<boolean>;
    getUserAndRoleByEmail(email: string): Promise<{ user: any; role: string } | null>;
}