import { ISuccessResponseHandler } from "../../../../shared/utils/successResponseHandler";

export interface IUpdateUserstatusUsecase {
  execute(userType: string, userId: string): Promise<ISuccessResponseHandler>;
}
