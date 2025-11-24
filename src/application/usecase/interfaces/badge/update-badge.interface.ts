import { UpdateBadgeReqDTO } from "../../../dto/request/badge.dto";
import { BadgeDto } from "../../../dto/response/badge.dto";

export interface IUpdateBadgeUsecase {
  execute(badgeId: string, data: UpdateBadgeReqDTO, adminId: string): Promise<void>;
}




