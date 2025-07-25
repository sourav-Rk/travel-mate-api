import { inject, injectable } from "tsyringe";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IAdminRepository } from "../../entities/repositoryInterfaces/admin/admin-repository.interface";
import { IGuideRepository } from "../../entities/repositoryInterfaces/guide/guide-repository.interface";

@injectable()
export class UserExistenceServive implements IUserExistenceService {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,

    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,

    @inject("IAdminRepository")
    private _adminRepository: IAdminRepository,

    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository
  ) {}

  async emailExists(email: string): Promise<boolean> {
    const [client, vendor, admin, guide] = await Promise.all([
      this._clientRepository.findByEmail(email),
      this._vendorRepository.findByEmail(email),
      this._adminRepository.findByEmail(email),
      this._guideRepository.findByEmail(email),
    ]);

    return Boolean(client || vendor || admin || guide);
  }

  async getUserAndRoleByEmail(
    email: string
  ): Promise<{ user: any; role: string } | null> {
    const [client, vendor, admin, guide] = await Promise.all([
      this._clientRepository.findByEmail(email),
      this._vendorRepository.findByEmail(email),
      this._adminRepository.findByEmail(email),
      this._guideRepository.findByEmail(email),
    ]);

    if (client) return { user: client, role: "client" };
    if (vendor) return { user: vendor, role: "vendor" };
    if (client) return { user: admin, role: "admin" };
    if (client) return { user: guide, role: "guide" };

    return null;
  }
}
