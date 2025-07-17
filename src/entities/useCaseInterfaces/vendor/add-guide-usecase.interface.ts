import { GuideDto, UserDto } from "../../../shared/dto/user.dto";

export interface IAddGuideUsecase {
    execute(data : UserDto,vendorId : string) : Promise<void>;
}