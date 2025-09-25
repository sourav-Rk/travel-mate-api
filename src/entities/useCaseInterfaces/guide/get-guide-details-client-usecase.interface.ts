import { GuideDetailsForClientDto } from "../../../shared/dto/guideDto";

export interface IGetGuideDetailsClientUsecase{
    execute(userId : string,guideId : string) : Promise<GuideDetailsForClientDto | null>;
}