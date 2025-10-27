import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IUpdateItineraryUsecase } from "../../../application/usecase/interfaces/itinerary/updateItinerary-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
} from "../../../shared/constants";
import { itinerarySchema } from "../../../shared/validations/package.validation";
import { IItineraryController } from "../../interfaces/controllers/itinerary/itinerary-controller.interface";

@injectable()
export class ItineraryController implements IItineraryController {
  constructor(
    @inject("IUpdateItineraryUsecase")
    private _updateItineraryUsecase: IUpdateItineraryUsecase
  ) {}

  async updateItinerary(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const itineraryData = req.body;
    const parsedResult = itinerarySchema.safeParse(itineraryData);
    if (!parsedResult.success) {
      console.log(parsedResult.error.format());
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.VALIDATION_FAILED,
        HTTP_STATUS.BAD_REQUEST
      );
      return;
    }

    await this._updateItineraryUsecase.execute(id, itineraryData);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.ITINERARY_UPDATED_SUCCESS
    );
  }
}
