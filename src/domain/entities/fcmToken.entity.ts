import { TRole } from "../../shared/constants";

export interface IFCMTokenEntity {
    _id ?: string;
    userId : string;
    token : string;
    createdAt : Date;
    updateAt ?: Date;
}