import { GuideInstructionMapper } from "../../../application/mapper/guideInstruction.mapper";
import { IGuideInstructionEntity } from "../../../domain/entities/guide-instruction.entity";
import { IGuideInstructionRepository } from "../../../domain/repositoryInterfaces/guide-instruction/guide-instruction-repository.interface";
import {
  guideInstructionDB,
  IGuideInstructionModel,
} from "../../database/models/guide-instruction.model";
import { BaseRepository } from "../baseRepository";

export class GuideInstructionRepository
  extends BaseRepository<IGuideInstructionModel, IGuideInstructionEntity>
  implements IGuideInstructionRepository
{
  constructor() {
    super(guideInstructionDB);
  }

  async findAllInstructions(
    packageIds: string[]
  ): Promise<IGuideInstructionEntity[] | []> {
    const instructions = await guideInstructionDB.aggregate([
      // Match instructions for the given packages
      {
        $match: {
          packageId: { $in: packageIds }
        }
      },
      // Lookup package details
      {
        $lookup: {
          from: "packages", // Your packages collection name
          localField: "packageId", // Field in instructions collection
          foreignField: "packageId", // Field in packages collection (assuming custom string ID)
          as: "packageDetails"
        }
      },
      // Unwind package details (since lookup returns array)
      {
        $unwind: {
          path: "$packageDetails",
          preserveNullAndEmptyArrays: true // Keep instructions even if package not found
        }
      },
      // Sort by creation date (newest first)
      {
        $sort: { createdAt: -1 }
      },
      // Project only the fields we need
      {
        $project: {
          // Instruction fields
          _id: 1,
          guideId: 1,
          packageId: 1,
          title: 1,
          message: 1,
          type: 1,
          priority: 1,
          location: 1,
          status: 1,
          sentAt: 1,
          readBy: 1,
          createdAt: 1,
          updatedAt: 1,
          // Package details
          "packageDetails.packageName": 1,
          "packageDetails.title": 1,
          "packageDetails.startDate": 1,
          "packageDetails.endDate": 1,
          "packageDetails.meetingPoint": 1,
        }
      }
    ]);

    return instructions.map((ins) => GuideInstructionMapper.mapToInstructionWithPackageDto(ins));
  }

  async addToReadBy(instructionId: string, userId: string): Promise<void> {
    await guideInstructionDB.findByIdAndUpdate(
      { _id: instructionId },
      { $addToSet: { readBy: userId } },
      { new: true }
    );
  }

  async findByGuideId(guideId: string): Promise<IGuideInstructionEntity[]> {
    return await guideInstructionDB.find({ guideId });
  }

  async findByPackageId(packageId: string): Promise<IGuideInstructionEntity[]> {
    return await guideInstructionDB.find({ packageId });
  }
}
