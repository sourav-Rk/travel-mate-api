import { IBadgeEntity } from "../../entities/badge.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IBadgeFilters {
  isActive?: boolean;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IBadgeRepository extends IBaseRepository<IBadgeEntity> {
  findAll(filters?: IBadgeFilters): Promise<{ badges: IBadgeEntity[]; total: number }>;
  findById(badgeId: string): Promise<IBadgeEntity | null>;
  findByBadgeId(badgeId: string): Promise<IBadgeEntity | null>;
  create(badge: Partial<IBadgeEntity>): Promise<IBadgeEntity>;
  update(badgeId: string, updates: Partial<IBadgeEntity>): Promise<IBadgeEntity | null>;
  delete(badgeId: string): Promise<boolean>;
  exists(badgeId: string): Promise<boolean>;
}

