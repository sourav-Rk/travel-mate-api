import { TRole } from "../../shared/constants";

import { IUserEntity } from "./user.entity";

export interface IOtpEntity{
    email : string;
    otp : string;
    createdAt : Date;
    role : TRole
    formData ?: Record<string,IUserEntity>;
}

