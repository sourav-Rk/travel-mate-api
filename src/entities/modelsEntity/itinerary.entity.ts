import { ObjectId } from "mongoose";

export interface IItineraryEntity {
    _id ?: ObjectId,
    packageId : ObjectId,
    days : IDay[],
    createdAt ?: Date,
    updatedAt ?: Date,
}


export interface IDay{
    dayNumber : number,
    title : string,
    description : string,
    activities : string[],
    accommodation : string,
    meals : IMeals,
    transfers : string[]
}

export interface IMeals{
    breakfast : boolean,
    lunch : boolean,
    dinner : boolean
}