import { injectable } from "tsyringe";

import { IKycEntity } from "../../../domain/entities/kyc.entity";
import { IKYCRepository } from "../../../domain/repositoryInterfaces/auth/kyc-repository.interface";
import { kycDB } from "../../database/models/kyc.model";

@injectable()
export class KYCRepository implements IKYCRepository {
  async save(data: Partial<IKycEntity>): Promise<IKycEntity> {
    return await kycDB.create(data);
  }

  async findByVendorId(vendorId: string): Promise<IKycEntity | null> {
    return await kycDB.findOne({ vendorId });
  }
}
