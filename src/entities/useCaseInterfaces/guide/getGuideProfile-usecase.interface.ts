import { GuideProfileDto } from "../../../shared/dto/guideDto";


export interface IGetGuideProfileUsecase {
    execute(id : any) : Promise<GuideProfileDto>;
}