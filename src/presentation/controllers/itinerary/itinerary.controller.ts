import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IItineraryController } from "../../interfaces/controllers/itinerary/itinerary-controller.interface";
import { IUpdateItineraryUsecase } from "../../../application/usecase/interfaces/itinerary/updateItinerary-usecase.interface";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
} from "../../../shared/constants";
import { itinerarySchema } from "../../../shared/validations/package.validation";

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
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, message: ERROR_MESSAGE.VALIDATION_FAILED });
      return;
    }

    await this._updateItineraryUsecase.execute(id, itineraryData);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGE.ITINERARY_UPDATED_SUCCESS,
    });
  }
}
