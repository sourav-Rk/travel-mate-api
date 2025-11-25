import { inject, injectable } from "tsyringe";

import { IGuideMessageRepository } from "../../../../domain/repositoryInterfaces/guide-chat/guide-message-repository.interface";
import { IMarkGuideMessagesReadUsecase } from "../../interfaces/guide-chat/mark-guide-messages-read.interface";

@injectable()
export class MarkGuideMessagesReadUsecase
  implements IMarkGuideMessagesReadUsecase
{
  constructor(
    @inject("IGuideMessageRepository")
    private readonly _guideMessageRepository: IGuideMessageRepository
  ) {}

  async execute(guideChatRoomId: string, userId: string): Promise<string[]> {
    return this._guideMessageRepository.markRead(guideChatRoomId, userId);
  }
}















