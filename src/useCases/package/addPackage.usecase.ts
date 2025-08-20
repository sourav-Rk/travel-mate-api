import { inject, injectable } from "tsyringe";
import { IAddPackageUsecase } from "../../entities/useCaseInterfaces/package/addPackage-usecase.interface";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { IItineraryRepository } from "../../entities/repositoryInterfaces/package/itinerary-repository.interface";
import { IActivitiesRepository } from "../../entities/repositoryInterfaces/package/activities-repository.interface";
import { IDBSession } from "../../entities/dbSessionInterfaces/session.interface";
import {
  PackageBasicDetailsDto,
  ItineraryDto,
  ActivityDto,
} from "../../shared/dto/packageDto";
import { IActivitiesEntity } from "../../entities/modelsEntity/activites.entity";

@injectable()
export class AddPackageUsecase implements IAddPackageUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository,

    @inject("IActivitiesRepository")
    private _activitiesRepository: IActivitiesRepository,

    @inject("IDBSession")
    private _dbSession: IDBSession
  ) {}

  async execute(
    basicDetails: PackageBasicDetailsDto,
    itinerary: ItineraryDto
  ): Promise<void> {
    await this._dbSession.start();

    try {
      await this._dbSession.withTransaction(async () => {
        const session = this._dbSession.getSession();

        const packageData = {
          agencyId: basicDetails.agencyId,
          packageName: basicDetails.packageName,
          title: basicDetails.title,
          slug: basicDetails.slug,
          description: basicDetails.description,
          category: basicDetails.category,
          tags: basicDetails.tags,
          meetingPoint: basicDetails.meetingPoint,
          images: basicDetails.images,
          maxGroupSize: basicDetails.maxGroupSize,
          price: basicDetails.price,
          cancellationPolicy: basicDetails.cancellationPolicy,
          termsAndConditions: basicDetails.termsAndConditions,
          startDate: new Date(basicDetails.startDate),
          endDate: new Date(basicDetails.endDate),
          duration: basicDetails.duration,
          inclusions: basicDetails.inclusions,
          exclusions: basicDetails.exclusions,
          status: "active",
        };

        const savedPackage = await this._packageRepository.save(
          packageData,
          session
        );

        if (!savedPackage._id) {
          throw new Error("Package id is missing after save");
        }

        let processedDays = [];

        for (const day of itinerary) {
          const activitiesData =
            day.activities?.map((activity: ActivityDto) => ({
              name: activity.name,
              dayNumber: activity.dayNumber,
              description: activity.description,
              duration: activity.duration,
              category: activity.category,
              priceIncluded: activity.priceIncluded || false,
            })) || [];

          let savedActivities: IActivitiesEntity[] = [];

          if (activitiesData.length > 0) {
            savedActivities = await this._activitiesRepository.saveMany(
              activitiesData,
              session
            );
          }

          console.log(savedActivities, "------>savedActivities");
          console.log(
            savedActivities.map((activity) => activity._id),
            "----->id"
          );

          processedDays.push({
            dayNumber: day.dayNumber,
            title: day.title,
            description: day.description,
            accommodation: day.accommodation,
            transfers: day.transfers,
            meals: {
              breakfast: day.meals.breakfast || false,
              lunch: day.meals.lunch || false,
              dinner: day.meals.dinner || false,
            },
            activities: savedActivities
              .filter((activity) => activity._id) 
              .map((activity) => activity._id.toString()),
          });
        }

        const itineraryData = {
          packageId: savedPackage._id,
          days: processedDays,
        };

        const savedItinerary = await this._itineraryRepository.save(
          itineraryData,
          session
        );

        await this._packageRepository.update(
          savedPackage._id,
          { itineraryId: savedItinerary._id },
          session
        );
      });
    } finally {
      await this._dbSession.end();
    }
  }
}
