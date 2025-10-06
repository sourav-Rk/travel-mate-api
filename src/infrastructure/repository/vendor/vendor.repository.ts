import mongoose from "mongoose";
import { injectable } from "tsyringe";
import { IVendorEntity } from "../../../domain/entities/vendor.entity";
import { IVendorRepository } from "../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { IVendorModel, vendorDB } from "../../database/models/vendor.model";
import { TRole } from "../../../shared/constants";
import { NotFoundError } from "../../../domain/errors/notFoundError";
import { BaseRepository } from "../baseRepository";
import { VendorMapper } from "../../../application/mapper/vendor.mapper";

@injectable()
export class VendorRepository
  extends BaseRepository<IVendorModel, IVendorEntity>
  implements IVendorRepository
{
  constructor() {
    super(vendorDB);
  }

  async findByEmail(email: string): Promise<IVendorEntity | null> {
    return await vendorDB.findOne({ email });
  }

  async findByNumber(phone: string): Promise<IVendorEntity | null> {
    return await vendorDB.findOne({ phone });
  }
  async findByIdAndUpdate(
    id: string,
    data: Partial<IVendorEntity>
  ): Promise<void> {
    await vendorDB.findByIdAndUpdate(id, data);
  }

  async findByIdAndUpdatePassword(
    id: any,
    password: string
  ): Promise<IVendorEntity | null> {
    return await vendorDB.findByIdAndUpdate(id, { password });
  }

  async getVendorWithAddressAndKyc(
    vendorId: string
  ): Promise<IVendorEntity | null> {
    const vendorDetails = await vendorDB.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(vendorId) },
      },
      {
        $lookup: {
          from: "addresses",
          localField: "_id",
          foreignField: "userId",
          as: "address",
        },
      },
      {
        $unwind: {
          path: "$address",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "kycs",
          localField: "_id",
          foreignField: "vendorId",
          as: "kycDetails",
        },
      },
      {
        $unwind: {
          path: "$kycDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          password: 0,
          _v: 0,
        },
      },
    ]);
    return vendorDetails[0];
  }

  async findByIdAndUpdateStatus(
    vendorId: string,
    status: string,
    reason?: string
  ): Promise<void> {
    console.log(reason);
    await vendorDB.findByIdAndUpdate(vendorId, {
      $set: { status: status, rejectionReason: reason },
    });
  }

  async findByIdAndUpdateBlock(vendorId: string): Promise<boolean> {
    const vendor = await vendorDB.findById(vendorId);
    if (!vendor) throw new NotFoundError("user not found");

    const updated = await vendorDB.findByIdAndUpdate(
      vendorId,
      { $set: { isBlocked: !vendor.isBlocked } },
      { new: true }
    );

    return updated?.isBlocked ?? false;
  }

  async find(
    searchTerm: string,
    status: string,
    userType: TRole,
    validPageNumber: number,
    validPageSize: number
  ): Promise<{ user: IVendorEntity[] | []; total: number }> {
    const filter: any = {};
    if (searchTerm) {
      filter.$or = [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { agencyName: { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (userType) {
      filter.role = userType;
    }

    if (userType === "vendor" && status && status !== "all") {
      filter.status = status;
    }

    const skip = (validPageNumber - 1) * validPageSize;
    const limit = validPageSize;

    const [user, total] = await Promise.all([
      vendorDB.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      vendorDB.countDocuments(filter),
    ]);

    const users = user.map((doc) => VendorMapper.toEntity(doc));

    return { user: users, total };
  }
}
