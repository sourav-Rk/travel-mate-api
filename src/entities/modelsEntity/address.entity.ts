import { ObjectId } from "mongoose";

export interface IAddressEntity{
    userId : ObjectId;
    address : string;
    street : string;
    city : string;
    state : string;
    pincode : string;
    country : string;
}