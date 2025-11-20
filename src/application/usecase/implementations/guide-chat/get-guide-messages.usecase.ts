import { inject, injectable } from "tsyringe";

import { GuideMessageDto } from "../../../dto/response/guide-chat.dto";
import { IGuideMessageRepository } from "../../../../domain/repositoryInterfaces/guide-chat/guide-message-repository.interface";
import { IGetGuideMessagesUsecase } from "../../interfaces/guide-chat/get-guide-messages.interface";
import { LocalGuideMessageMapper } from "../../../mapper/local-guide-chat.mapper";

@injectable()
export class GetGuideMessagesUsecase implements IGetGuideMessagesUsecase {
  constructor(
    @inject("IGuideMessageRepository")
    private readonly _guideMessageRepository: IGuideMessageRepository
  ) {}

  async execute(
    guideChatRoomId: string,
    limit: number,
    before?: Date
  ): Promise<GuideMessageDto[]> {
    const messages = await this._guideMessageRepository.listByRoom(
      guideChatRoomId,
      limit,
      before
    );

    return messages.map((message) =>
      LocalGuideMessageMapper.mapToGuideMessageDto(message)
    );
  }
}






