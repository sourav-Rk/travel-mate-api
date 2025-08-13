import { injectable } from "tsyringe";

import { IGuideEntity } from "../../../entities/modelsEntity/guide.entity";
import { IGuideRepository } from "../../../entities/repositoryInterfaces/guide/guide-repository.interface";
import { guideDB } from "../../../frameworks/database/models/guide.model";

@injectable()
export class GuideRepository implements IGuideRepository {
  async find(
    filter: any,
    skip: number,
    limit: number
  ): Promise<{ user: IGuideEntity[] | []; total: number }> {
    const [user, total] = await Promise.all([
      guideDB
        .find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      guideDB.countDocuments(filter),
    ]);
    return { user, total };
  }

  async findById(id: any): Promise<IGuideEntity | null> {
    return await guideDB.findById(id);
  }

  async findByEmail(email: string): Promise<IGuideEntity | null> {
    return await guideDB.findOne({ email });
  }

  async findByNumber(phone: string): Promise<IGuideEntity | null> {
    return await guideDB.findOne({ phone });
  }

  async save(data: Partial<IGuideEntity>): Promise<IGuideEntity> {
    return await guideDB.create(data);
  }

  async findByIdAndUpdatePassword(
    guideId: string,
    password: string
  ): Promise<IGuideEntity | null> {
    return await guideDB.findByIdAndUpdate(guideId, {
      password,
      status: "verified",
    });
  }
}
