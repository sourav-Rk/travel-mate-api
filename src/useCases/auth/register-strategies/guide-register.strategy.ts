import { injectable } from "tsyringe";
import { IRegisterStrategy } from "./register-strategy.interface";
import { IUserEntity } from "../../../entities/modelsEntity/user.entity";
import { UserDto } from "../../../shared/dto/user.dto";

@injectable()
export class GuideRegisterStrategy implements IRegisterStrategy{
    constructor(
      
    ){}

    async register(user: UserDto): Promise<IUserEntity | void> {
        
    }
}