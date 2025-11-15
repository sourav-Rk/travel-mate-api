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
 
      {
        $match: {
          packageId: { $in: packageIds }
        }
      },
 
      {
        $lookup: {
          from: "packages",
          localField: "packageId", 
          foreignField: "packageId", 
          as: "packageDetails"
        }
      },
      
      {
        $unwind: {
          path: "$packageDetails",
          preserveNullAndEmptyArrays: true 
        }
      },
     
      {
        $sort: { createdAt: -1 }
      },
      
      {
        $project: {
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
