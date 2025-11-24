import { inject, injectable } from "tsyringe";

import { IGuideMessageRepository } from "../../../../domain/repositoryInterfaces/guide-chat/guide-message-repository.interface";
import { GuideMessageDto } from "../../../dto/response/guide-chat.dto";
import { LocalGuideMessageMapper } from "../../../mapper/local-guide-chat.mapper";
import { IGetGuideMessagesUsecase } from "../../interfaces/guide-chat/get-guide-messages.interface";

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












