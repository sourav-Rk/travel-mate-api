import { container } from "tsyringe";

import { IAdminRepository } from "../../entities/repositoryInterfaces/admin/admin-repository.interface";
import { IAddressRepository } from "../../entities/repositoryInterfaces/auth/address-repository.interface";
import { IKYCRepository } from "../../entities/repositoryInterfaces/auth/kyc-repository.interface";
import { IOTPRepository } from "../../entities/repositoryInterfaces/auth/otp-repository.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { IGuideRepository } from "../../entities/repositoryInterfaces/guide/guide-repository.interface";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/redis-token-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { AdminRepository } from "../../interfaceAdapters/repositories/admin/admin.repository";
import { AddressRepository } from "../../interfaceAdapters/repositories/auth/address.repository";
import { KYCRepository } from "../../interfaceAdapters/repositories/auth/kyc.repository";
import { OTPRepository } from "../../interfaceAdapters/repositories/auth/otp.repository";
import { ClientRepository } from "../../interfaceAdapters/repositories/client/client.repository";
import { GuideRepository } from "../../interfaceAdapters/repositories/guide/guide.repository";
import { RedisTokenRepository } from "../../interfaceAdapters/repositories/redis/redis-token.repository";
import { VendorRepository } from "../../interfaceAdapters/repositories/vendor/vendor.repository";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { PackageRepository } from "../../interfaceAdapters/repositories/package/package.repository";
import { IItineraryRepository } from "../../entities/repositoryInterfaces/package/itinerary-repository.interface";
import { ItineraryRepository } from "../../interfaceAdapters/repositories/package/itinerary.repository";
import { IActivitiesRepository } from "../../entities/repositoryInterfaces/package/activities-repository.interface";
import { ActivitiesRepository } from "../../interfaceAdapters/repositories/package/activities.repository";
import { IDBSession } from "../../entities/dbSessionInterfaces/session.interface";
import { MongooseDBSession } from "../database/mongooseDBSession/mongooseDBSession";

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

    container.register<IPackageRepository>('IPackageRepository',{
      useClass : PackageRepository
    })

    container.register<IItineraryRepository>('IItineraryRepository',{
      useClass : ItineraryRepository
    })

    container.register<IActivitiesRepository>('IActivitiesRepository',{
      useClass : ActivitiesRepository
    })

    //redis token repository
    container.register<IRedisTokenRepository>('IRedisTokenRepository',{
      useClass : RedisTokenRepository
    })

    //database session
    container.register<IDBSession>('IDBSession',{
      useClass : MongooseDBSession
    })

    
  }
}
