import { GuideDto } from "../../../shared/dto/user.dto";


export interface IGetGuideDetailsUsecase{
    execute(vendorId : any,id : any) : Promise<GuideDto>;
}