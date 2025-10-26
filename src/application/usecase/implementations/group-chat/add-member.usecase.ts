import { inject, injectable } from "tsyringe";
import { IAddMemberUsecase } from "../../interfaces/group-chat/add-member-usecase.interface";
import { IGroupChatRepository } from "../../../../domain/repositoryInterfaces/group-chat/group-chat-repository.interface";
import { IGroupMessageRepository } from "../../../../domain/repositoryInterfaces/group-chat/group-message-repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { USER_TYPES } from "../../../dto/request/admin.dto";

@injectable()
export class AddMemberUsecase implements IAddMemberUsecase {
  constructor(
    @inject("IGroupChatRepository")
    private _groupChatRepository: IGroupChatRepository,
  ) {}

  async execute(groupId: string, clientId: string): Promise<void> {
    if (!groupId || !clientId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const groupExist = await this._groupChatRepository.findById(groupId);

    if (!groupExist) {
      throw new NotFoundError(ERROR_MESSAGE.GROUP.GROUP_NOT_FOUND);
    }

    const member = {
      userId: clientId,
      userType: USER_TYPES.CLIENT,
    };

    await this._groupChatRepository.addMember(groupId, member);
  }
}
