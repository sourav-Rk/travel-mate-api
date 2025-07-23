import { injectable } from "tsyringe";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IVendorEntity } from "../../../entities/modelsEntity/vendor.entity";
import { vendorDB } from "../../../frameworks/database/models/vendor.model";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";
import mongoose from "mongoose";

@injectable()
export class VendorRepository implements IVendorRepository {
  async findByEmail(email: string): Promise<IVendorEntity | null> {
    return await vendorDB.findOne({ email });
  }

  async findByNumber(phone: string): Promise<IVendorEntity | null> {
    return await vendorDB.findOne({ phone });
  }

  async findById(vendorId: string): Promise<IVendorEntity | null> {
    return await vendorDB.findById(vendorId);
  }

  async findByIdAndUpdatePassword(id : any,password : string) : Promise<IVendorEntity | null>{
    return await vendorDB.findByIdAndUpdate(id,{password});
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


  async save(data: Partial<IVendorEntity>): Promise<IVendorEntity> {
    return await vendorDB.create(data);
  }

  async findByIdAndUpdateStatus(
    vendorId: string,
    status: string,
    reason ?: string
  ): Promise<void> {
    console.log(reason)
   await vendorDB.findByIdAndUpdate(vendorId, { $set: { status: status,rejectionReason : reason } });  
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
    filter: any,
    skip: number,
    limit: number
  ): Promise<{ user: IVendorEntity[] | []; total: number }> {
    const [user, total] = await Promise.all([
      vendorDB.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      vendorDB.countDocuments(filter),
    ]);

    return { user, total };
  }
}
