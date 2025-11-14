import { GetVolunteerPostsReqDTO } from "../../../../application/dto/request/volunteer-post.dto";
import { VolunteerPostListDto } from "../../../../application/dto/response/volunteer-post.dto";

export interface IGetVolunteerPostsUsecase {
  execute(filters: GetVolunteerPostsReqDTO): Promise<VolunteerPostListDto>;
}

