import { UpdateGuideProfileDTO } from "../../../dto/request/guide.dto";

export interface IUpdateGuideProfileUsecase {
  execute(guideId: string, data: UpdateGuideProfileDTO): Promise<void>;
}

