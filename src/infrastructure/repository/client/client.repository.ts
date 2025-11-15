import { FilterQuery } from "mongoose";
import { injectable } from "tsyringe";

import { UserMapper } from "../../../application/mapper/user.mapper";
import { IClientEntity } from "../../../domain/entities/client.entity";
import { NotFoundError } from "../../../domain/errors/notFoundError";
import { IClientRepository } from "../../../domain/repositoryInterfaces/client/client.repository.interface";
import { TRole } from "../../../shared/constants";
import { clientDB, IClientModel } from "../../database/models/client.model";
import { BaseRepository } from "../baseRepository";

@injectable()
export class ClientRepository
  extends BaseRepository<IClientModel, IClientEntity>
  implements IClientRepository
{
  constructor() {
    super(clientDB, UserMapper.toEntity);
  }

  async findByEmail(email: string): Promise<IClientEntity | null> {
    return await clientDB.findOne({ email });
  }

  async findByNumber(phone: string): Promise<IClientEntity | null> {
    return await clientDB.findOne({ phone });
  }

  async findByIdAndUpdatePassword(
    id: string,
    password: string
  ): Promise<IClientEntity | null> {
    return await clientDB.findByIdAndUpdate(id, { password });
  }

  async findByIdAndUpdateStatus(id: string): Promise<boolean> {
    const client = await clientDB.findById(id);
    if (!client) throw new NotFoundError("user not found");
    const updated = await clientDB.findByIdAndUpdate(
      id,
      {
        $set: { isBlocked: !client.isBlocked },
      },
      { new: true }
    );

    if (!updated) throw new Error("Failed to update vendor block status");

    return updated.isBlocked;
  }

  async find(
    searchTerm: string,
    status: string,
    userType: TRole,
    validPageNumber: number,
    validPageSize: number
  ): Promise<{ user: IClientEntity[] | []; total: number }> {
    const filter: FilterQuery<IClientModel> = {};

    if (searchTerm) {
      filter.$or = [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (userType) {
      filter.role = userType;
    }

    if (status && status !== "all") {
      if (status === "active") {
        filter.isBlocked = false;
      } else if (status === "blocked") {
        filter.isBlocked = true;
      }
    }

    const skip = (validPageNumber - 1) * validPageSize;
    const limit = validPageSize;

    const [docs, total] = await Promise.all([
      clientDB.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      clientDB.countDocuments(filter),
    ]);

    const users = docs.map((doc) => UserMapper.toEntity(doc));

    return { user: users, total };
  }
}
