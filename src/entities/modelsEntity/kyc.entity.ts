import { ObjectId } from "mongoose";

export interface IKycEntity{
    vendorId ?: string;
    pan : string;
    gstin : string;
    documents : string[];
    status : string;
    registrationNumber : string;
    createdAt : Date;
    updatedAt : Date;
}