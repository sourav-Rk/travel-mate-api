import { CreateBadgeReqDTO } from "../../../dto/request/badge.dto";
import { BadgeDto } from "../../../dto/response/badge.dto";

export interface ICreateBadgeUsecase {
  execute(data: CreateBadgeReqDTO, adminId: string): Promise<BadgeDto>;
}






