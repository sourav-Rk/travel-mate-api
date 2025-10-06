export interface IAssignGuideToTripUsecase{
    execute(packageId : string,guideId : string) : Promise<void>;
}