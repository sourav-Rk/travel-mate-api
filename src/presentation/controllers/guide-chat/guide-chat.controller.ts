import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { GuideChatCreateDto } from "../../../application/dto/request/guide-chat.dto";
import { ICreateGuideChatRoomUsecase } from "../../../application/usecase/interfaces/guide-chat/create-guide-chat-room.interface";
import { IGetGuideChatRoomsUsecase } from "../../../application/usecase/interfaces/guide-chat/get-guide-chat-rooms.interface";
import { IGetGuideMessagesUsecase } from "../../../application/usecase/interfaces/guide-chat/get-guide-messages.interface";
import { IGetBookingByChatRoomUsecase } from "../../../application/usecase/interfaces/local-guide-booking/get-booking-by-chat-room.interface";
import { ValidationError } from "../../../domain/errors/validationError";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
} from "../../../shared/constants";
import { IGuideChatController } from "../../interfaces/controllers/guide-chat/guide-chat.controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class GuideChatController implements IGuideChatController {
  constructor(
    @inject("ICreateGuideChatRoomUsecase")
    private readonly _createGuideChatRoomUsecase: ICreateGuideChatRoomUsecase,
    @inject("IGetGuideChatRoomsUsecase")
    private readonly _getGuideChatRoomsUsecase: IGetGuideChatRoomsUsecase,
    @inject("IGetGuideMessagesUsecase")
    private readonly _getGuideMessagesUsecase: IGetGuideMessagesUsecase,
    @inject("IGetBookingByChatRoomUsecase")
    private readonly _getBookingByChatRoomUsecase: IGetBookingByChatRoomUsecase
  ) {}

  async createRoom(req: Request, res: Response): Promise<void> {
    const body = plainToInstance(GuideChatCreateDto, req.body);
    const errors = await validate(body);
    if (errors.length > 0) {
      throw new ValidationError(Object.values(errors[0].constraints ?? {})[0]);
    }

    const room = await this._createGuideChatRoomUsecase.execute(body);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.OPERATION_SUCCESS,
      room,
      "room"
    );
  }

  async getRooms(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const rooms = await this._getGuideChatRoomsUsecase.execute(userId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      rooms,
      "rooms"
    );
  }

  async getMessages(req: Request, res: Response): Promise<void> {
    const { guideChatRoomId } = req.params;
    const limit = Number(req.query.limit) || 20;
    const beforeParam = req.query.before
      ? new Date(String(req.query.before))
      : undefined;

    const messages = await this._getGuideMessagesUsecase.execute(
      guideChatRoomId,
      limit,
      beforeParam
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      messages,
      "messages"
    );
  }

  async getBookingByChatRoom(req: Request, res: Response): Promise<void> {
    const { guideChatRoomId } = req.params;
    if (!guideChatRoomId) {
      throw new ValidationError(ERROR_MESSAGE.CHAT.CHAT_ROOM_ID_REQUIRED);
    }

    const booking = await this._getBookingByChatRoomUsecase.execute(
      guideChatRoomId
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      booking,
      "booking"
    );
  }
}
