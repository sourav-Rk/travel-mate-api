import mongoose, { Document } from "mongoose";
import { IGuideInstructionEntity } from "../../../domain/entities/guide-instruction.entity";
import { guideInstructionSchema } from "../schemas/guide-instructions.schema";

export interface IGuideInstructionModel
  extends Omit<IGuideInstructionEntity, "_id" | "guideId">,
    Document {
  guideId: mongoose.Types.ObjectId;
  _id: mongoose.Types.ObjectId;
}

export const guideInstructionDB = mongoose.model(
  "guideInstructions",
  guideInstructionSchema
);
