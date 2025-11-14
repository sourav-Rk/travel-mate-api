import { SearchVolunteerPostsReqDTO } from "../../../../application/dto/request/volunteer-post.dto";
import { VolunteerPostListDto } from "../../../../application/dto/response/volunteer-post.dto";

export interface ISearchVolunteerPostsUsecase {
  execute(filters: SearchVolunteerPostsReqDTO): Promise<VolunteerPostListDto>;
}

