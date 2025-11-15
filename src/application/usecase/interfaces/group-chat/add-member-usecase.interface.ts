export interface IAddMemberUsecase{
    execute(groupId : string,clientId : string) : Promise<void>;
}