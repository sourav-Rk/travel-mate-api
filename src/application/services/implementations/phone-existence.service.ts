import { inject, injectable } from "tsyringe";

import { IAdminRepository } from "../../../domain/repositoryInterfaces/admin/admin-repository.interface";
import { IClientRepository } from "../../../domain/repositoryInterfaces/client/client.repository.interface";
import { IGuideRepository } from "../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { IVendorRepository } from "../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { IPhoneExistenceService } from "../interfaces/phone-existence-service.interface";

@injectable()
export class PhoneExistenceService implements IPhoneExistenceService {
  constructor(
    @inject("IClientRepository")
    private _ClientRepository: IClientRepository,

    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,

    @inject("IAdminRepository")
    private _adminRepository: IAdminRepository,

    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository
  ) {}

  async phoneExists(phone: string): Promise<boolean> {
    const [client, admin, vendor, guide] = await Promise.all([
      this._ClientRepository.findByNumber(phone),
      this._vendorRepository.findByNumber(phone),
      this._adminRepository.findByNumber(phone),
      this._guideRepository.findByNumber(phone),
    ]);

    return Boolean(client || vendor || admin || guide);
  }
}
