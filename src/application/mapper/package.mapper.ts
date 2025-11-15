import { IPackageEntity } from "../../domain/entities/package.entity";
import { IPackageModel } from "../../infrastructure/database/models/package.model";
import {
  PackageListingTableDto,
  PackageListingUserSideDto,
} from "../dto/response/packageDto";

export class PackageMapper {
  static toEntity(doc: IPackageModel): IPackageEntity {
    return {
      _id: String(doc._id),
      packageId: doc.packageId,
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
      minGroupSize: doc.minGroupSize,
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
      guideId: doc.guideId ? String(doc.guideId) : undefined,
      paymentAlertSentAt: doc.paymentAlertSentAt,
    };
  }

  static mapToPackageToVendorTableDto(
    doc: IPackageEntity
  ): PackageListingTableDto {
    return {
      _id: doc._id,
      packageId: doc.packageId!,
      category: doc.category,
      duration: doc.duration,
      images: doc.images,
      maxGroupSize: doc.maxGroupSize,
      meetingPoint: doc.meetingPoint,
      packageName: doc.packageName,
      price: doc.price,
      title: doc.title,
      status: doc.status ?? "",
      isBlocked: doc.isBlocked ?? false,
      guideId: doc.guideId ? doc.guideId : "",
    };
  }

  static mapPackageToUserListingDto(
    doc: IPackageEntity
  ): PackageListingUserSideDto {
    return {
      _id: doc._id ?? "",
      packageId: doc.packageId!,
      category: doc.category,
      description: doc.description,
      duration: doc.duration,
      packageName: doc.packageName,
      images: doc.images,
      maxGroupSize: doc.maxGroupSize,
      meetingPoint: doc.meetingPoint,
      price: doc.price,
      tags: doc.tags,
      title: doc.title,
    };
  }

  static mapPackageToGuideTableDto(
    doc: IPackageEntity
  ): PackageListingTableDto {
    return {
      packageId: doc.packageId!,
      packageName: doc.packageName,
      title: doc.title,
      category: doc.category,
      duration: doc.duration,
      maxGroupSize: doc.maxGroupSize,
      images: doc.images,
      isBlocked: doc.isBlocked!,
      meetingPoint: doc.meetingPoint,
      price: doc.price,
      status: doc.status!,
      startDate: doc.startDate.toISOString(),
      endDate: doc.endDate.toISOString(),
    };
  }
}
