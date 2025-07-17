import { inject, injectable } from "tsyringe";
import { IPhoneExistenceService } from "../../entities/serviceInterfaces/phone-existence-service.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IAdminRepository } from "../../entities/repositoryInterfaces/admin/admin-repository.interface";
import { IGuideRepository } from "../../entities/repositoryInterfaces/guide/guide-repository.interface";

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
