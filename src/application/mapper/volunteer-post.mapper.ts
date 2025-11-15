import { IVolunteerPostEntity } from "../../domain/entities/volunteer-post.entity";
import { IVolunteerPostModel } from "../../infrastructure/database/models/volunteer-post.model";
import { LocalGuideDetailsDto } from "../dto/response/local-guide.dto";
import { VolunteerPostDetailDto, VolunteerPostListItemDto } from "../dto/response/volunteer-post.dto";

export class VolunteerPostMapper {
  static toEntity(
    doc: IVolunteerPostModel | (IVolunteerPostModel & { distance?: number })
  ): IVolunteerPostEntity {
    let profileIdValue: string;
    if (
      typeof doc.localGuideProfileId === "object" &&
      doc.localGuideProfileId !== null &&
      "_id" in doc.localGuideProfileId
    ) {
      profileIdValue = String(
        (doc.localGuideProfileId as { _id: unknown })._id
      );
    } else {
      profileIdValue = String(doc.localGuideProfileId);
    }

    return {
      _id: String(doc._id),
      localGuideProfileId: profileIdValue,
      title: doc.title,
      description: doc.description,
      content: doc.content,
      category: doc.category,
      location: {
        type: doc.location.type as "Point",
        coordinates: doc.location.coordinates as [number, number],
        city: doc.location.city,
        state: doc.location.state,
        country: doc.location.country,
      },
      images: doc.images || [],
      tags: doc.tags || [],
      offersGuideService: doc.offersGuideService,
      status: doc.status,
      views: doc.views || 0,
      likes: doc.likes || 0,
      publishedAt: doc.publishedAt || undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static mapToPostDetailsDto(
    doc: IVolunteerPostEntity,
    guideDetails: LocalGuideDetailsDto
  ): VolunteerPostDetailDto {
    return {
      _id: String(doc._id),
      localGuideProfileId: doc.localGuideProfileId,
      title: doc.title,
      description: doc.description,
      content: doc.content,
      category: doc.category,
      location: doc.location,
      images: doc.images,
      tags: doc.tags,
      offersGuideService: doc.offersGuideService,
      status: doc.status,
      views: doc.views,
      likes: doc.likes,
      publishedAt: doc.publishedAt,
      createdAt: doc.createdAt!,
      updatedAt: doc.updatedAt!,
      guideDetails,
    };
  }
   
    static mapToListItemDto(entity: IVolunteerPostEntity): VolunteerPostListItemDto {
    return {
      _id: String(entity._id),
      localGuideProfileId: entity.localGuideProfileId,
      title: entity.title,
      description: entity.description,
      category: entity.category,
      images: entity.images,
      offersGuideService: entity.offersGuideService,
      status: entity.status,
      views: entity.views,
      likes: entity.likes,
      location : entity.location,
      publishedAt: entity.publishedAt,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

}
