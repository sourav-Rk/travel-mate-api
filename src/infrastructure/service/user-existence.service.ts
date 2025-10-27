import { inject, injectable } from "tsyringe";

import { IUserEntity } from "../../domain/entities/user.entity";
import { IAdminRepository } from "../../domain/repositoryInterfaces/admin/admin-repository.interface";
import { IClientRepository } from "../../domain/repositoryInterfaces/client/client.repository.interface";
import { IGuideRepository } from "../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { IVendorRepository } from "../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { IUserExistenceService } from "../../domain/service-interfaces/user-existence-service.interface";

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
  ): Promise<{ user: IUserEntity|null; role: string } | null> {
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
