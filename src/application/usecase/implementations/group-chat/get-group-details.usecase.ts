import { inject, injectable } from "tsyringe";

import { ValidationError } from "../../../../domain/errors/validationError";
import { IGroupChatRepository } from "../../../../domain/repositoryInterfaces/group-chat/group-chat-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { GroupChatDetailsDto } from "../../../dto/response/groupChatDto";
import { GroupChatMapper } from "../../../mapper/group-chat.mapper";
import { IGetGroupDetailsUsecase } from "../../interfaces/group-chat/get-group-details-usecase.interface";

@injectable()
export class GetGroupDetailsUsecase implements IGetGroupDetailsUsecase {
  constructor(
    @inject("IGroupChatRepository")
    private _groupChatRepository: IGroupChatRepository
  ) {}

  async execute(groupChatId: string): Promise<GroupChatDetailsDto> {
    if (!groupChatId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const groupDetails =
      await this._groupChatRepository.getGroupWithMemberDetails(groupChatId);

    return GroupChatMapper.mapToGroupChatDetails(groupDetails);
  }
}
