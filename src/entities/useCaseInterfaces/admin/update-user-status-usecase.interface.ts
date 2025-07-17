import { ISuccessResponseHandler } from "../../../shared/utils/successResponseHandler";

export interface IUpdateUserstatusUsecase{
    execute(userType : string,userId:any) : Promise<ISuccessResponseHandler>;
}