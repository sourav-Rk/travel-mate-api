import mongoose, { Document, ObjectId } from "mongoose";

import { IVolunteerPostEntity } from "../../../domain/entities/volunteer-post.entity";
import { volunteerPostSchema } from "../schemas/volunteer-post.schema";

export interface IVolunteerPostModel
  extends Omit<IVolunteerPostEntity, "_id" | "localGuideProfileId">,
    Document {
  _id: ObjectId;
  localGuideProfileId: mongoose.Types.ObjectId;
}

export const volunteerPostDB = mongoose.model<IVolunteerPostModel>(
  "volunteer_posts",
  volunteerPostSchema
);

