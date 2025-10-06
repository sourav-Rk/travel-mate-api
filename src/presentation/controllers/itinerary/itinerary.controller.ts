import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IItineraryController } from "../../interfaces/controllers/itinerary/itinerary-controller.interface";
import { IUpdateItineraryUsecase } from "../../../application/usecase/interfaces/itinerary/updateItinerary-usecase.interface";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";

@injectable()
export class ItineraryController implements IItineraryController {
  constructor(
    @inject("IUpdateItineraryUsecase")
    private _updateItineraryUsecase: IUpdateItineraryUsecase
  ) {}

  async updateItinerary(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const itineraryData = req.body;
    await this._updateItineraryUsecase.execute(id, itineraryData);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGE.ITINERARY_UPDATED_SUCCESS,
    });
  }
}
