import { injectable } from "tsyringe";

import { IClientEntity } from "../../../entities/modelsEntity/client.entity";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client.repository.interface";
import { clientDB } from "../../../frameworks/database/models/client.model";
import { TRole } from "../../../shared/constants";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";
import { UserMapper } from "../../mappers/user.mapper";

@injectable()
export class ClientRepository implements IClientRepository {
  async save(data: Partial<IClientEntity>): Promise<IClientEntity> {
    const modelData = await clientDB.create(data);
    return UserMapper.toEntity(modelData);
  }

  async findById(id: string): Promise<IClientEntity | null> {
    return await clientDB.findById(id);
  }

  async findByEmail(email: string): Promise<IClientEntity | null> {
    return await clientDB.findOne({ email });
  }

  async findByNumber(phone: string): Promise<IClientEntity | null> {
    return await clientDB.findOne({ phone });
  }

  async findByIdAndUpdatePassword(
    id: any,
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

  async updateClientProfileById(
    id: string,
    data: Partial<IClientEntity>
  ): Promise<void> {
    await clientDB.findByIdAndUpdate(id, { $set: data });
  }

  async find(
    searchTerm: string,
    status: string,
    userType: TRole,
    validPageNumber: number,
    validPageSize: number
  ): Promise<{ user: IClientEntity[] | []; total: number }> {
    const filter: any = {};

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
