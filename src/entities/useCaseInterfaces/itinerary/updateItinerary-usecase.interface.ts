import { ItineraryEditDto } from "../../../shared/dto/itineraryDto";

export interface IUpdateItineraryUsecase{
    execute(itineraryId : string,data : ItineraryEditDto) : Promise<void>;
}