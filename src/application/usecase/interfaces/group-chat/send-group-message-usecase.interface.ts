import { IGroupMessageEntity } from "../../../../domain/entities/group-message.entity";
import { SendGroupMessageDTO } from "../../../dto/response/groupMessageDto";

export interface ISendGroupMessageUsecase {
  execute(data: SendGroupMessageDTO): Promise<IGroupMessageEntity>;
}
