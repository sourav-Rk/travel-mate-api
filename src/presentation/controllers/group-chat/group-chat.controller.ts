import { inject, injectable } from "tsyringe";
import { IGroupChatController } from "../../interfaces/controllers/group-chat/group-chat-controller.interface";
import { IGetGroupsUsecase } from "../../../application/usecase/interfaces/group-chat/get-groups-usecase.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IGetGroupDetailsUsecase } from "../../../application/usecase/interfaces/group-chat/get-group-details-usecase.interface";

@injectable()
export class GroupChatController implements IGroupChatController {
  constructor(
    @inject("IGetGroupsUsecase")
    private _getGroupsUsecase: IGetGroupsUsecase,

    @inject("IGetGroupDetailsUsecase")
    private _getGroupDetailsUsecase: IGetGroupDetailsUsecase
  ) {}

  async getGroups(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { searchTerm } = req.query;
    const data = await this._getGroupsUsecase.execute(
      userId,
      searchTerm as string
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      data
    );
  }

  async getGroupDetails(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params;
    const data = await this._getGroupDetailsUsecase.execute(groupId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      data
    );
  }
}
