import { inject, injectable } from "tsyringe";

import { IGuideMessageRepository } from "../../../../domain/repositoryInterfaces/guide-chat/guide-message-repository.interface";
import { IMarkGuideMessagesDeliveredUsecase } from "../../interfaces/guide-chat/mark-guide-messages-delivered.interface";

@injectable()
export class MarkGuideMessagesDeliveredUsecase
  implements IMarkGuideMessagesDeliveredUsecase
{
  constructor(
    @inject("IGuideMessageRepository")
    private readonly _guideMessageRepository: IGuideMessageRepository
  ) {}

  async execute(guideChatRoomId: string, userId: string): Promise<string[]> {
    return this._guideMessageRepository.markDelivered(guideChatRoomId, userId);
  }
}

