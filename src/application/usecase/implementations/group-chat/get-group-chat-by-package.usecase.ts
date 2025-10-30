import { inject, injectable } from "tsyringe";

import { IGroupChatEntity } from "../../../../domain/entities/group-chat.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IGroupChatRepository } from "../../../../domain/repositoryInterfaces/group-chat/group-chat-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { IGetGroupChatByPackageUsecase } from "../../interfaces/group-chat/get-group-chat-by-package-usecase.interface";

@injectable()
export class GetGroupChatByPackageUsecase
  implements IGetGroupChatByPackageUsecase
{
  constructor(
    @inject("IGroupChatRepository")
    private _groupChatRepository: IGroupChatRepository
  ) {}

  async execute(packageId: string): Promise<IGroupChatEntity | null> {
    if (!packageId) {
      throw new CustomError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGE.ID_REQUIRED);
    }

    const groupChat = await this._groupChatRepository.findByPackage(packageId);

    if (!groupChat) {
      throw new NotFoundError(ERROR_MESSAGE.GROUP.NO_GROUP_CHAT);
    }

    return groupChat;
  }
}






