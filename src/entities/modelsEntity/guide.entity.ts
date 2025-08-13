import { IUserEntity } from "./user.entity";

export interface IGuideEntity extends IUserEntity{
    agencyId : string
    alternatePhone : string;
    dob ?: Date | string;
    languageSpoken : string[];
    yearOfExperience : string;
    bio : string;
    documents : string[];
}