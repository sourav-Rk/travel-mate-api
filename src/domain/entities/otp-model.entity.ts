import { TRole } from "../../shared/constants";

export interface IOtpEntity{
    email : string;
    otp : string;
    createdAt : Date;
    role : TRole
    formData ?: Record<string,any>;
}

