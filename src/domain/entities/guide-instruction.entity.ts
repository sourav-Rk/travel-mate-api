import { INSTRUCTION_PRIORITY, INSTRUCTION_TYPE } from "../../shared/constants";

export interface IGuideInstructionEntity {
  _id?: string;
  guideId: string;
  packageId: string;
  title: string;
  message: string;
  type:INSTRUCTION_TYPE;
  priority?: INSTRUCTION_PRIORITY;
  location?: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  sentAt?: Date;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}
