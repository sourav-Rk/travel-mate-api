import { UpdateLocalGuideProfileReqDTO } from "../../../dto/request/local-guide.dto";

export interface IUpdateLocalGuideProfileUsecase {
  execute(
    userId: string,
    data: UpdateLocalGuideProfileReqDTO
  ): Promise<void>;
}

