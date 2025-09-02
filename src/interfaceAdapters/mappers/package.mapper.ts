import { IPackageEntity } from "../../entities/modelsEntity/package.entity";
import { IPackageModel } from "../../frameworks/database/models/package.model";
import { PackageListingTableDto, PackageListingUserSideDto } from "../../shared/dto/packageDto";

export class PackageMapper {
  static toEntity(doc: IPackageModel): IPackageEntity {
    return {
      _id: String(doc._id),
      agencyId: String(doc.agencyId),
      packageName: doc.packageName,
      title: doc.title,
      slug: doc.slug,
      description: doc.description,
      category: doc.category,
      tags: doc.tags,
      status: doc.status,
      meetingPoint: doc.meetingPoint,
      images: doc.images,
      maxGroupSize: doc.maxGroupSize,
      minGroupSize : doc.minGroupSize,
      price: doc.price,
      cancellationPolicy: doc.cancellationPolicy,
      termsAndConditions: doc.termsAndConditions,
      inclusions: doc.inclusions,
      exclusions: doc.exclusions,
      startDate: doc.startDate,
      endDate: doc.endDate,
      duration: doc.duration,
      isBlocked: doc.isBlocked,
      itineraryId: String(doc.itineraryId),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static mapToPackageToVendorTableDto(
    doc: IPackageEntity
  ): PackageListingTableDto {
    return {
      _id: doc._id,
      category: doc.category,
      duration: doc.duration,
      images: doc.images,
      maxGroupSize: doc.maxGroupSize,
      meetingPoint: doc.meetingPoint,
      packageName: doc.packageName,
      price: doc.price,
      title: doc.title,
      status : doc.status ?? ""
    };
  }

  static mapPackageToUserListingDto(doc : IPackageEntity) : PackageListingUserSideDto{
    return {
      _id : doc._id ?? "",
      category : doc.category,
      description : doc.description,
      duration : doc.duration,
      packageName : doc.packageName,
      images : doc.images,
      maxGroupSize : doc.maxGroupSize,
      meetingPoint : doc.meetingPoint,
      price : doc.price,
      tags : doc.tags,
      title : doc.title
    }
  }
}
