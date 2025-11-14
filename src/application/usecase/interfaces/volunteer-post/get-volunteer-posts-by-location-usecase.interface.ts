import { GetVolunteerPostsByLocationReqDTO } from "../../../../application/dto/request/volunteer-post.dto";
import { VolunteerPostListDto } from "../../../../application/dto/response/volunteer-post.dto";

export interface IGetVolunteerPostsByLocationUsecase {
  execute(filters: GetVolunteerPostsByLocationReqDTO): Promise<VolunteerPostListDto>;
}

