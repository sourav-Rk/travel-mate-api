import { injectable } from "tsyringe";

import { IGuideEntity } from "../../../entities/modelsEntity/guide.entity";
import { IGuideRepository } from "../../../entities/repositoryInterfaces/guide/guide-repository.interface";
import { guideDB } from "../../../frameworks/database/models/guide.model";

@injectable()
export class GuideRepository implements IGuideRepository {
  async find(
    agencyId: string,
    searchTerm: string,
    status: string,
    validPageNumber: number,
    validPageSize: number
  ): Promise<{ user: IGuideEntity[] | []; total: number }> {
    const filter: any = { agencyId };

    if (searchTerm) {
      filter.$or = [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    const skip = (validPageNumber - 1) * validPageSize;
    const limit = validPageSize;

    const [user, total] = await Promise.all([
      guideDB
        .find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      guideDB.countDocuments(filter),
    ]);

    const users: IGuideEntity[] = user.map((doc) => ({
      ...doc.toObject(),
      agencyId: doc.agencyId.toString(),
    }));

    return { user: users, total };
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
    const doc = await guideDB.create(data);
    return {
      ...doc.toObject(),
      agencyId: doc.agencyId.toString(),
    };
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
