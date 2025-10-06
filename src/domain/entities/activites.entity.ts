
export interface IActivitiesEntity {
    _id : string,
    name : string,
    dayNumber : number,
    description : string,
    duration : string,
    category : string,
    priceIncluded : boolean,
    createdAt ?: Date,
    updatedAt ?: Date
}