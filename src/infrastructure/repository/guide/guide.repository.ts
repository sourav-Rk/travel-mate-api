import { injectable } from "tsyringe";

import { IGuideEntity } from "../../../domain/entities/guide.entity";
import { IGuideRepository } from "../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { guideDB, IGuideModel } from "../../database/models/guide.model";
import { BaseRepository } from "../baseRepository";
import { GuideMapper } from "../../../application/mapper/guide.mapper";

@injectable()
export class GuideRepository
  extends BaseRepository<IGuideModel, IGuideEntity>
  implements IGuideRepository
{
  constructor() {
    super(guideDB, GuideMapper.toEntity);
  }

  async find(
    validPageNumber: number,
    validPageSize: number,
    searchTerm: string,
    status: string,
    agencyId: any,
    languages?: string[],
    minExperience?: number,
    maxExperience?: number,
    gender?: string
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

    if (languages && languages.length > 0) {
      const lowercaseLanguages = languages.map((lang) => lang.toLowerCase());

      filter.languageSpoken = {
        $in: lowercaseLanguages.map((lang) => new RegExp(`^${lang}$`, "i")),
      };
    }

    if (gender) {
      filter.gender = gender;
    }

    if (minExperience !== undefined || maxExperience !== undefined) {
      const experienceRanges = ["0-1", "1-3", "3-5", "5-10", "10+"];
      const matchingRanges: string[] = [];

      for (const range of experienceRanges) {
        let rangeMin: number, rangeMax: number;

        if (range === "10+") {
          rangeMin = 10;
          rangeMax = Infinity;
        } else {
          const [minStr, maxStr] = range.split("-");
          rangeMin = parseInt(minStr);
          rangeMax = parseInt(maxStr);
        }

        // Check if this range overlaps with the filter range
        const matchesMin =
          minExperience === undefined || rangeMax >= minExperience;
        const matchesMax =
          maxExperience === undefined || rangeMin <= maxExperience;

        if (matchesMin && matchesMax) {
          matchingRanges.push(range);
        }
      }

      if (matchingRanges.length > 0) {
        filter.yearOfExperience = { $in: matchingRanges }; // Fixed: yearOfExperience not yearsOfExperience
      }
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
      _id: doc._id.toString(),
      agencyId: doc.agencyId.toString(),
    }));

    return { user: users, total };
  }

  async findByEmail(email: string): Promise<IGuideEntity | null> {
    return await guideDB.findOne({ email });
  }

  async findByNumber(phone: string): Promise<IGuideEntity | null> {
    return await guideDB.findOne({ phone });
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
