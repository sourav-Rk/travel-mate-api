import { ClientSession, FilterQuery } from "mongoose";
import { injectable } from "tsyringe";

import {
  IPackage,
  PaginatedPackagesRepo,
} from "../../../application/dto/response/packageDto";
import { PackageMapper } from "../../../application/mapper/package.mapper";
import { IPackageEntity } from "../../../domain/entities/package.entity";
import { IPackageRepository } from "../../../domain/repositoryInterfaces/package/package-repository.interface";
import { PackageStatus, TRole } from "../../../shared/constants";
import { IPackageModel, packageDB } from "../../database/models/package.model";
import { BaseRepository } from "../baseRepository";

interface ISortField {
  price?: 1 | -1;
  "duration.days"?: 1 | -1;
  createdAt?: 1 | -1;
}

@injectable()
export class PackageRepository
  extends BaseRepository<IPackageModel, IPackageEntity>
  implements IPackageRepository
{
  constructor() {
    super(packageDB, PackageMapper.toEntity);
  }

  async findByPackageId(packageId: string): Promise<IPackageEntity | null> {
    return await packageDB.findOne({ packageId });
  }

  async findByItineraryId(id: string): Promise<IPackageEntity | null> {
    return await packageDB.findOne({ itineraryId: id });
  }

  async findByPackagesByTodayDate(startDate: Date): Promise<IPackageEntity[]> {
    return await packageDB.find({ startDate });
  }

  async findByPackagesApplicationDeadline(
    deadline: Date
  ): Promise<IPackageEntity[]> {
    return await packageDB.find({ applicationDeadline: deadline });
  }

  async findByGuideId(guideId: string): Promise<IPackageEntity[] | []> {
    return await packageDB.find({ guideId });
  }

  async save(data: IPackageEntity, session?: ClientSession): Promise<IPackageEntity> {
    const options = session ? { session } : {};
    const modelData = await packageDB
      .create([data], options)
      .then((result) => result[0]);
    return PackageMapper.toEntity(modelData);
  }

  async update(
    id: string,
    data: Partial<IPackageEntity>,
    session?: ClientSession
  ): Promise<IPackageEntity> {
    const options = session
      ? { session, new: true, runValidators: true }
      : { new: true, runValidators: true };
    const result = await packageDB.findOneAndUpdate({ _id: id }, data, options);

    if (!result) {
      throw new Error(`Package with id ${id} not found`);
    }

    return PackageMapper.toEntity(result);
  }

  async updatePackageStatus(
    packageId: string,
    status: PackageStatus
  ): Promise<IPackageEntity | null> {
    return await packageDB.findByIdAndUpdate(
      packageId,
      { $set: { status: status } },
      { new: true }
    );
  }

  async updateBlock(
    packageId: string,
    isBlocked: boolean
  ): Promise<IPackageEntity | null> {
    return await packageDB.findByIdAndUpdate(packageId, {
      $set: { isBlocked: !isBlocked },
    });
  }

  async find(criteria: {
    userId: string;
    userType: TRole;
    searchTerm: string;
    status: string;
    category: string;
    pageNumber: number;
    pageSize: number;
  }): Promise<PaginatedPackagesRepo> {
    const {
      userId,
      userType,
      searchTerm,
      status,
      category,
      pageNumber,
      pageSize,
    } = criteria;

    const filter: FilterQuery<IPackageModel> = {};

    if (userType === "vendor") {
      filter.agencyId = userId;
    }

    if (searchTerm) {
      filter.$or = [
        { packageName: { $regex: searchTerm, $options: "i" } },
        { title: { $regex: searchTerm, $options: "i" } },
        { tags: { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (status && status !== "all" && status !== "blocked") {
      filter.status = status;
    }

    if (status === "blocked") {
      filter.isBlocked = true;
    }

    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    const [packages, total] = await Promise.all([
      await packageDB
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      await packageDB.countDocuments(filter),
    ]);

    const packageDetails = packages.map((doc) => PackageMapper.toEntity(doc));

    return { packages: packageDetails, total };
  }

  async getPackageDetails(id: string): Promise<IPackage> {
    const packageData = await packageDB.aggregate([
      { $match: { packageId: id } },

      {
        $lookup: {
          from: "itinerarys",
          localField: "itineraryId",
          foreignField: "_id",
          as: "itineraryDetails",
        },
      },
      { $unwind: "$itineraryDetails" },

      
      { $unwind: "$itineraryDetails.days" },

      {
        $lookup: {
          from: "activities",
          localField: "itineraryDetails.days.activities",
          foreignField: "_id",
          as: "itineraryDetails.days.activityDetails",
        },
      },

      {
        $group: {
          _id: "$_id",
          package: { $first: "$$ROOT" },
          days: { $push: "$itineraryDetails.days" },
        },
      },

      { $addFields: { "package.itineraryDetails.days": "$days" } },

      { $replaceRoot: { newRoot: "$package" } },
    ]);

    return packageData[0];
  }

  async getActivePackages(
    search: string,
    categories: string[],
    priceRange: number[],
    duration: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string
  ): Promise<PaginatedPackagesRepo> {
    const filter: FilterQuery<IPackageModel> = {
      status: "active",
      isBlocked: false,
      applicationDeadline: { $gte: new Date() },
    };

    if (search) {
      filter.$or = [
        { packageName: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    if (categories && categories.length > 0) {
      filter.category = {
        $in: categories.map((cat) => new RegExp(`^${cat}$`, "i")),
      };
    }

    if (priceRange && priceRange.length === 2) {
      filter.price = { $gte: priceRange[0], $lte: priceRange[1] };
    }

    if (duration && duration.includes("-")) {
      const [min, max] = duration.split("-").map(Number);
      filter["duration.days"] = { $gte: min, $lte: max };
    }

    //pagination
    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    //sorting
    const sortField: Record<string, 1 | -1> = {};

    if (sortBy === "price-high") sortField.price = -1;
    else if (sortBy === "price-low") sortField.price = 1;
    else if (sortBy === "days-long") sortField["duration.days"] = -1;
    else if (sortBy === "days-short") sortField["duration.days"] = 1;
    else sortField.createdAt = -1;

    const [packages, total] = await Promise.all([
      await packageDB.find(filter).skip(skip).limit(limit).sort(sortField),
      await packageDB.countDocuments(filter),
    ]);

    const packageDetails = packages.map((doc) => PackageMapper.toEntity(doc));

    return { packages: packageDetails, total };
  }

  async getFeaturedPackages(category: string): Promise<IPackageEntity[]> {
    const packages = await packageDB
      .find({
        category: {
          $regex: `^${category}$`,
          $options: "i",
        },
      })
      .limit(3);

    return packages.map((doc) => PackageMapper.toEntity(doc));
  }

  async getTrendingPackages(): Promise<IPackageEntity[]> {
    const packages = await packageDB
      .find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(6);

    return packages.map((doc) => PackageMapper.toEntity(doc));
  }

  async findAssignedPackages(
    packageIds: string[],
    searchTerm: string,
    status: string,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedPackagesRepo> {
    const filter: FilterQuery<IPackageModel> = {
      packageId: { $in: packageIds },
    };

    if (searchTerm) {
      filter.$or = [
        { packageName: { $regex: searchTerm, $options: "i" } },
        { title: { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (status !== "all") {
      filter.status = status;
    }

    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    const [packages, total] = await Promise.all([
      packageDB.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      packageDB.countDocuments(filter),
    ]);

    return {
      packages: packages.map((doc) => PackageMapper.toEntity(doc)),
      total,
    };
  }

  async findByAgencyId(vendorId: string): Promise<IPackageEntity[] | []> {
    return await packageDB.find({ agencyId: vendorId });
  }


  async countAllPackages(): Promise<number> {
    return await packageDB.countDocuments({});
  }

  async countCompletedPackages(): Promise<number> {
    return await packageDB.countDocuments({ status: "completed" });
  }
}
