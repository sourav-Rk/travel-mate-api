import { GetLocalGuidesByLocationReqDTO } from "../../../../application/dto/request/local-guide.dto";
import { LocalGuideListDto } from "../../../../application/dto/response/local-guide.dto";

export interface IGetLocalGuidesByLocationUsecase {
  execute(filters: GetLocalGuidesByLocationReqDTO): Promise<LocalGuideListDto>;
}











