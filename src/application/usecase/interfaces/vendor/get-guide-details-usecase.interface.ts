import { GuideDto } from "../../../dto/response/user.dto";

export interface IGetGuideDetailsUsecase {
  execute(vendorId: any, id: any): Promise<GuideDto>;
}
