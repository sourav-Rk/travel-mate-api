import { container } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { ClientRepository } from "../../interfaceAdapters/repositories/client/client.repository";
import { IOTPRepository } from "../../entities/repositoryInterfaces/auth/otp-repository.interface";
import { OTPRepository } from "../../interfaceAdapters/repositories/auth/otp.repository";
import { IAdminRepository } from "../../entities/repositoryInterfaces/admin/admin-repository.interface";
import { AdminRepository } from "../../interfaceAdapters/repositories/admin/admin.repository";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/redis-token-repository.interface";
import { RedisTokenRepository } from "../../interfaceAdapters/repositories/redis/redis-token.repository";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { VendorRepository } from "../../interfaceAdapters/repositories/vendor/vendor.repository";
import { IKYCRepository } from "../../entities/repositoryInterfaces/auth/kyc-repository.interface";
import { KYCRepository } from "../../interfaceAdapters/repositories/auth/kyc.repository";
import { IAddressRepository } from "../../entities/repositoryInterfaces/auth/address-repository.interface";
import { AddressRepository } from "../../interfaceAdapters/repositories/auth/address.repository";
import { IGuideRepository } from "../../entities/repositoryInterfaces/guide/guide-repository.interface";
import { GuideRepository } from "../../interfaceAdapters/repositories/guide/guide.repository";

export class RepositoryRegistry {
  static registerRepositories(): void {
 
    container.register<IClientRepository>('IClientRepository',{
      useClass : ClientRepository
    })

    container.register<IVendorRepository>('IVendorRepository',{
      useClass : VendorRepository
    })

    container.register<IGuideRepository>('IGuideRepository',{
      useClass : GuideRepository
    })

    container.register<IAdminRepository>('IAdminRepository',{
      useClass : AdminRepository
    })

    container.register<IOTPRepository>('IOTPRepository',{
      useClass : OTPRepository
    })

    container.register<IKYCRepository>('IKYCRepository',{
      useClass : KYCRepository
    })

    container.register<IAddressRepository>('IAddressRepository',{
      useClass : AddressRepository
    })

    //redis token repository
    container.register<IRedisTokenRepository>('IRedisTokenRepository',{
      useClass : RedisTokenRepository
    })

    
  }
}
