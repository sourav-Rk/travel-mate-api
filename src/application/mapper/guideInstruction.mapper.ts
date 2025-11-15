import { IGuideInstructionEntity } from "../../domain/entities/guide-instruction.entity";
import { IGuideInstructionModel } from "../../infrastructure/database/models/guide-instruction.model";
import { GuideInstructionWithPackageDto, IGuideInstructionAggregationResult } from "../dto/response/guide-instructionDto";

export class GuideInstructionMapper {
  static toEntity(doc: IGuideInstructionModel): IGuideInstructionEntity {
    return {
      guideId: String(doc.guideId),
      packageId: doc.packageId,
      message: doc.message,
      title: doc.title,
      type: doc.type,
      priority: doc.priority,
      location: doc.location,
      readBy: doc.readBy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      _id: String(doc._id),
    };
  }

  static mapToInstructionWithPackageDto(doc: IGuideInstructionAggregationResult): GuideInstructionWithPackageDto {
  return {
    _id: doc._id?.toString(),
    guideId: doc.guideId?.toString(),
    packageId: doc.packageId,
    title: doc.title,
    message: doc.message,
    type: doc.type,
    priority: doc.priority,
    location: doc.location,
    sentAt: doc.sentAt,
    readBy: doc.readBy || [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,

    packageDetails: doc.packageDetails ? {
      packageName: doc.packageDetails.packageName,
      title: doc.packageDetails.title,
      startDate: doc.packageDetails.startDate,
      endDate: doc.packageDetails.endDate,
      meetingPoint: doc.packageDetails.meetingPoint,
    } : undefined
  };
}
}
