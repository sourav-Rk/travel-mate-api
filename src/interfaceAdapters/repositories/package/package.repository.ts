import { injectable } from "tsyringe";
import { packageDB } from "../../../frameworks/database/models/package.model";
import { IPackageRepository } from "../../../entities/repositoryInterfaces/package/package-repository.interface";
import { IPackageEntity } from "../../../entities/modelsEntity/package.entity";
import { PaginatedPackages } from "../../../entities/modelsEntity/paginated-packages.entity";
import mongoose from "mongoose";
import { IPackage } from "../../../shared/dto/packageDto";

@injectable()
export class PackageRepository implements IPackageRepository {
  async findById(id: string): Promise<IPackageEntity | null> {
    return await packageDB.findById(id);
  }

  async save(data: IPackageEntity, session?: any): Promise<IPackageEntity> {
    const options = session ? { session } : {};
    return await packageDB.create([data], options).then((result) => result[0]);
  }

  async update(
    id: any,
    data: Partial<IPackageEntity>,
    session?: any
  ): Promise<IPackageEntity> {
    const options = session
      ? { session, new: true, runValidators: true }
      : { new: true, runValidators: true };
    const result = await packageDB.findByIdAndUpdate(id, data, options);

    if (!result) {
      throw new Error(`Package with id ${id} not found`);
    }

    return result;
  }

  async find(
    skip: number,
    limit: number,
    filter: any
  ): Promise<PaginatedPackages> {
    const [packages, total] = await Promise.all([
      await packageDB
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      await packageDB.countDocuments(filter),
    ]);

    return { packages, total };
  }

  async getPackageDetails(id: any): Promise<IPackage> {
    const packageData = await packageDB.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },

      {
        $lookup: {
          from: "itinerarys",
          localField: "itineraryId",
          foreignField: "_id",
          as: "itineraryDetails",
        },
      },
      { $unwind: "$itineraryDetails" },

      // flatten itinerary days
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
}
