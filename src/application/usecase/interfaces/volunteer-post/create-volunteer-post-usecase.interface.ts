import { CreateVolunteerPostReqDTO } from "../../../../application/dto/request/volunteer-post.dto";

export interface ICreateVolunteerPostUsecase {
  execute(
    userId: string,
    data: CreateVolunteerPostReqDTO
  ): Promise<void>;
}

