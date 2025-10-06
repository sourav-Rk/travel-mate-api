import { UserDto } from "../../../dto/response/user.dto";
import { ISuccessResponseHandler } from "../../../../shared/utils/successResponseHandler";

export interface IRegisterUserUsecase {
  execute(user: UserDto): Promise<ISuccessResponseHandler>;
}
