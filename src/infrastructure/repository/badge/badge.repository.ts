import { FilterQuery } from "mongoose";
import { injectable } from "tsyringe";

import { BadgeMapper } from "../../../application/mapper/badge.mapper";
import { IBadgeEntity } from "../../../domain/entities/badge.entity";
import {
  IBadgeFilters,
  IBadgeRepository,
} from "../../../domain/repositoryInterfaces/badge/badge-repository.interface";
import { badgeDB, IBadgeModel } from "../../database/models/badge.model";
import { BaseRepository } from "../baseRepository";

@injectable()
export class BadgeRepository
  extends BaseRepository<IBadgeModel, IBadgeEntity>
  implements IBadgeRepository
{
  constructor() {
    super(badgeDB, BadgeMapper.toEntity, BadgeMapper.toModel);
  }

  async findAll(
    filters?: IBadgeFilters
  ): Promise<{ badges: IBadgeEntity[]; total: number }> {
    const query: FilterQuery<IBadgeModel> = {};

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters?.category) {
      query.category = filters.category;
    }

    /**
     *Search across name, description, and badgeId
     */
    if (filters?.search && filters.search.trim()) {
      const searchRegex = new RegExp(filters.search.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { badgeId: searchRegex },
      ];
    }

    /**
     *Get total count
     */
    const total = await badgeDB.countDocuments(query).exec();

    /**
     *Apply pagination if provided
     */
    let badgesQuery = badgeDB.find(query).sort({ priority: 1, createdAt: -1 });

    if (filters?.page !== undefined && filters?.limit !== undefined) {
      const page = Math.max(1, filters.page);
      const limit = Math.max(1, Math.min(100, filters.limit));
      const skip = (page - 1) * limit;
      badgesQuery = badgesQuery.skip(skip).limit(limit);
    }

    const badges = await badgesQuery.exec();

    return {
      badges: badges.map((badge) => BadgeMapper.toEntity(badge)),
      total,
    };
  }

  async findById(badgeId: string): Promise<IBadgeEntity | null> {
    const badge = await badgeDB.findById(badgeId).exec();
    if (!badge) return null;
    return BadgeMapper.toEntity(badge);
  }

  async findByBadgeId(badgeId: string): Promise<IBadgeEntity | null> {
    const badge = await badgeDB.findOne({ badgeId }).exec();
    if (!badge) return null;
    return BadgeMapper.toEntity(badge);
  }

  async create(badge: Partial<IBadgeEntity>): Promise<IBadgeEntity> {
    const modelData = BadgeMapper.toModel(badge);
    const createdBadge = await badgeDB.create(modelData);
    return BadgeMapper.toEntity(createdBadge);
  }

  async update(
    badgeId: string,
    updates: Partial<IBadgeEntity>
  ): Promise<IBadgeEntity | null> {
    const modelData = BadgeMapper.toModel(updates);
    // Remove badgeId from updates to prevent changing it
    delete modelData.badgeId;

    const updatedBadge = await badgeDB
      .findOneAndUpdate({ badgeId }, modelData, { new: true })
      .exec();

    if (!updatedBadge) return null;
    return BadgeMapper.toEntity(updatedBadge);
  }

  async delete(badgeId: string): Promise<boolean> {
    /**
     *Soft delete: set isActive to false
     */
    const result = await badgeDB
      .findOneAndUpdate({ badgeId }, { isActive: false }, { new: true })
      .exec();

    return result !== null;
  }

  async exists(badgeId: string): Promise<boolean> {
    const count = await badgeDB.countDocuments({ badgeId }).exec();
    return count > 0;
  }
}
