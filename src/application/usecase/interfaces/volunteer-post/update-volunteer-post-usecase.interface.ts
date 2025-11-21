import { UpdateVolunteerPostReqDTO } from "../../../../application/dto/request/volunteer-post.dto";

export interface IUpdateVolunteerPostUsecase {
  execute(
    userId: string,
    postId: string,
    data: UpdateVolunteerPostReqDTO
  ): Promise<void>;
}

