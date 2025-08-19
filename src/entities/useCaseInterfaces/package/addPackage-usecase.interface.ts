import { ItineraryDto, PackageBasicDetailsDto } from "../../../shared/dto/packageDto";

export interface IAddPackageUsecase {
  execute(basicDetails : PackageBasicDetailsDto, itinerary : ItineraryDto): Promise<void>;
}
