import { UserDto } from "../../../dto/response/user.dto";

export interface IAddGuideUsecase {
  execute(data: UserDto, vendorId: string): Promise<void>;
}
