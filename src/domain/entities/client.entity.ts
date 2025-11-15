import { IUserEntity } from "./user.entity";

export interface IClientEntity extends IUserEntity {
  bio?: string;
  isBlocked: boolean;
  isLocalGuide?: boolean;
  localGuideProfileId?: string;
}
