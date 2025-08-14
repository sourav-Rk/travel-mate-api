import { ObjectId } from "mongoose";
import { IUserEntity } from "./user.entity";

export interface IGuideEntity extends IUserEntity{
    agencyId : ObjectId
    alternatePhone : string;
    dob ?: Date | string;
    languageSpoken : string[];
    yearOfExperience : string;
    bio : string;
    documents : string[];
}