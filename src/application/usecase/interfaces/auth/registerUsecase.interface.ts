import { ISuccessResponseHandler } from "../../../../shared/utils/successResponseHandler";
import { UserDto } from "../../../dto/response/user.dto";

export interface IRegisterUserUsecase {
  execute(user: UserDto): Promise<ISuccessResponseHandler>;
}
