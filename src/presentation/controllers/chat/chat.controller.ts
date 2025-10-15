import { inject, injectable } from "tsyringe";
import { IChatController } from "../../interfaces/controllers/chat/chat-controller.interface";
import { IGetMessagesUsecase } from "../../../application/usecase/interfaces/chat/get-message-usecase.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IGetChatHistoryUsecase } from "../../../application/usecase/interfaces/chat/get-chat-history-usecase.interface";
import { IChatRoomEntity } from "../../../domain/entities/chatroom.entity";
import { IGetChatroomUsecase } from "../../../application/usecase/interfaces/chat/get-chatroom-usecase.interface";

@injectable()
export class ChatController implements IChatController {
  constructor(
    @inject("IGetMessagesUsecase")
    private _getMessagesUsecase: IGetMessagesUsecase,

    @inject("IGetChatHistoryUsecase")
    private _getChatHistoryUsecase: IGetChatHistoryUsecase,

    @inject("IGetChatroomUsecase")
    private _getChatroomUsecase: IGetChatroomUsecase
  ) {}

  async getMessages(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { chatroomId, limit = 20, before } = req.query;

    const messages = await this._getMessagesUsecase.execute(
      String(chatroomId),
      Number(limit),
      userId,
      String(before)
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.MESSAGES_FETCHED,
      messages
    );
  }

  async getChatHistory(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { page, limit, searchTerm } = req.query;
    const data = await this._getChatHistoryUsecase.execute(
      userId,
      Number(page),
      Number(limit),
      String(searchTerm)
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.MESSAGES_FETCHED,
      data
    );
  }

  async getChatroom(req: Request, res: Response): Promise<void> {
    const { chatroomId } = req.params;
    const data = await this._getChatroomUsecase.execute(chatroomId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      data
    );
  }
}
