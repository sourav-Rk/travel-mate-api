import {
  ItineraryDto,
  PackageBasicDetailsDto,
} from "../../../dto/response/packageDto";

export interface IAddPackageUsecase {
  execute(
    basicDetails: PackageBasicDetailsDto,
    itinerary: ItineraryDto
  ): Promise<void>;
}
