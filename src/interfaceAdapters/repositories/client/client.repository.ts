import { injectable } from "tsyringe";

import { IClientEntity } from "../../../entities/modelsEntity/client.entity";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client.repository.interface";
import { clientDB } from "../../../frameworks/database/models/client.model";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";

@injectable()
export class ClientRepository implements IClientRepository {
  async save(data: Partial<IClientEntity>): Promise<IClientEntity> {
    return await clientDB.create(data);
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

  async findByIdAndUpdatePassword(id : any,password : string) : Promise<IClientEntity | null>{
    return await clientDB.findByIdAndUpdate(id,{password});
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
    filter: any,
    skip: number,
    limit: number
  ): Promise<{ user: IClientEntity[] | []; total: number }> {
    const [user, total] = await Promise.all([
      clientDB.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      clientDB.countDocuments(filter),
    ]);
    return { user, total };
  }
}
