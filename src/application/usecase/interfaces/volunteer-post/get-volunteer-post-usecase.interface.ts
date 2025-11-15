import { VolunteerPostDetailDto } from "../../../../application/dto/response/volunteer-post.dto";

export interface IGetVolunteerPostUsecase {
  execute(postId: string,viewUserId : string, incrementViews?: boolean): Promise<VolunteerPostDetailDto>;
}

