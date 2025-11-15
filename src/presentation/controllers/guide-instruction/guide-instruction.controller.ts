import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { CreateInstructionDto } from "../../../application/dto/request/guide-instruction.dto";
import { ICreateInstructionUsecase } from "../../../application/usecase/interfaces/guide-instruction/create-instruction-usecase.interface";
import { IGetInstructionsClientUsecase } from "../../../application/usecase/interfaces/guide-instruction/get-instructions-client-usecase.interface";
import { IMarkAllInstructionsReadUseCase } from "../../../application/usecase/interfaces/guide-instruction/mark-all-instructions-usecase.interface";
import { IMarkInstructionReadUseCase } from "../../../application/usecase/interfaces/guide-instruction/mark-instruction-read-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IGuideInstructionController } from "../../interfaces/controllers/guide-instruction/guide-instruction-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class GuideInstructionController implements IGuideInstructionController {
  constructor(
    @inject("ICreateInstructionUsecase")
    private _createInstuctionUsecase: ICreateInstructionUsecase,

    @inject("IGetInstructionsClientUsecase")
    private _getInstructionsClientUsecae: IGetInstructionsClientUsecase,

    @inject("IMarkInstructionReadUseCase")
    private _markInstructionReadUsecae: IMarkInstructionReadUseCase,

    @inject("IMarkAllInstructionsReadUseCase")
    private _markAllInstructionsReadUsecase: IMarkAllInstructionsReadUseCase
  ) {}

  async createInstruction(req: Request, res: Response): Promise<void> {
    const guideId = (req as CustomRequest).user.id;
    const instructionData = req.body as CreateInstructionDto;

    await this._createInstuctionUsecase.execute(guideId, instructionData);

    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      SUCCESS_MESSAGE.GUIDE_INSTRUCTION.ADDED_SUCCESSFULLY
    );
  }

  async getInstructionsClient(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const data = await this._getInstructionsClientUsecae.execute(userId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      data
    );
  }

  async markInstructionRead(req: Request, res: Response): Promise<void> {
    const { instructionId } = req.params;
    const userId = (req as CustomRequest).user.id;
    await this._markInstructionReadUsecae.execute(instructionId, userId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.GUIDE_INSTRUCTION.INSTRUCTION_MARKED_AS_READ
    );
  }

  async markAllInstructionsRead(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    await this._markAllInstructionsReadUsecase.execute(userId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.GUIDE_INSTRUCTION.ALL_INSTRUCTIONS_MARKED_AS_READ
    );
  }
}
