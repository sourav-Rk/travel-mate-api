import { inject, injectable } from "tsyringe";
import {  IDeleteActivityUsecase } from "../../entities/useCaseInterfaces/activity/deleteActivity-usecase.interface";
import { IActivitiesRepository } from "../../entities/repositoryInterfaces/package/activities-repository.interface";
import { ValidationError } from "../../shared/utils/error/validationError";
import { ERROR_MESSAGE } from "../../shared/constants";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { IItineraryRepository } from "../../entities/repositoryInterfaces/package/itinerary-repository.interface";

@injectable()
export class DeleteActivityUsecase implements IDeleteActivityUsecase{
    constructor(
        @inject('IActivitiesRepository')
        private _activitiesRepository : IActivitiesRepository,

        @inject('IItineraryRepository')
        private _itinerayRepository : IItineraryRepository
    ){}

    async execute(itineraryId: string, dayNumber: number, id: string): Promise<void> {
         if(!id || !itineraryId){
            throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
        }

        const activityExist = await this._activitiesRepository.findById(id);
        const itineraryExist = await this._itinerayRepository.findById(itineraryId);
        if(!activityExist){
            throw new NotFoundError(ERROR_MESSAGE.ACTIVITY_NOT_EXIST);
        }
        if(!itineraryExist){
            throw new NotFoundError(ERROR_MESSAGE.ITINERARY_NOT_FOUND);
        }

        await this._itinerayRepository.removeActivityFromDay(itineraryId,dayNumber,id);

        await this._activitiesRepository.delete(id);
    } 
}