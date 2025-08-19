import { ItineraryEditDto } from "../../../shared/dto/itineraryDto";
import { IItineraryEntity } from "../../modelsEntity/itinerary.entity";

export interface IUpdateItineraryUsecase{
    execute(itineraryId : string,data : ItineraryEditDto) : Promise<void>;
}