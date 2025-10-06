import { ItineraryEditDto } from "../../../dto/response/itineraryDto";

export interface IUpdateItineraryUsecase {
  execute(itineraryId: string, data: ItineraryEditDto): Promise<void>;
}
