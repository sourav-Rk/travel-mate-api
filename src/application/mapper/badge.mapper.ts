import { IBadgeEntity } from "../../domain/entities/badge.entity";
import { IBadgeModel } from "../../infrastructure/database/models/badge.model";

export class BadgeMapper {
  static toEntity(model: IBadgeModel): IBadgeEntity {
    return {
      _id: model._id.toString(),
      badgeId: model.badgeId,
      name: model.name,
      description: model.description,
      category: model.category,
      icon: model.icon,
      criteria: model.criteria.map((criterion) => ({
        type: criterion.type,
        value: criterion.value,
        additionalCondition: criterion.additionalCondition
          ? {
              type: criterion.additionalCondition.type,
              value: criterion.additionalCondition.value,
            }
          : undefined,
      })),
      priority: model.priority,
      isActive: model.isActive,
      createdBy: model.createdBy?.toString(),
      updatedBy: model.updatedBy?.toString(),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  static toModel(entity: Partial<IBadgeEntity>): Partial<IBadgeModel> {
    const model: Partial<IBadgeModel> = {};

    if (entity.badgeId !== undefined) model.badgeId = entity.badgeId;
    if (entity.name !== undefined) model.name = entity.name;
    if (entity.description !== undefined) model.description = entity.description;
    if (entity.category !== undefined) model.category = entity.category;
    if (entity.icon !== undefined) model.icon = entity.icon;
    if (entity.criteria !== undefined) {
      model.criteria = entity.criteria.map((criterion) => ({
        type: criterion.type,
        value: criterion.value,
        additionalCondition: criterion.additionalCondition
          ? {
              type: criterion.additionalCondition.type,
              value: criterion.additionalCondition.value,
            }
          : undefined,
      }));
    }
    if (entity.priority !== undefined) model.priority = entity.priority;
    if (entity.isActive !== undefined) model.isActive = entity.isActive;
    if (entity.createdBy !== undefined && entity.createdBy) {
      model.createdBy = entity.createdBy as unknown as import("mongoose").Types.ObjectId;
    }
    if (entity.updatedBy !== undefined && entity.updatedBy) {
      model.updatedBy = entity.updatedBy as unknown as import("mongoose").Types.ObjectId;
    }

    return model;
  }

}

