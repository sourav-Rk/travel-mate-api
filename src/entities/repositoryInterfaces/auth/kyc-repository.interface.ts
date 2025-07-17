import { IKycEntity } from "../../modelsEntity/kyc.entity";

export interface IKYCRepository{
    save(data : Partial<IKycEntity>) : Promise<IKycEntity>;
    findByVendorId(vendorId : string) : Promise<IKycEntity | null>;
}