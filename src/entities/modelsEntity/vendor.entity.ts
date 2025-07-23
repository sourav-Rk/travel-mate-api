import { IUserEntity } from "./user.entity";

export interface IVendorEntity extends IUserEntity {
  agencyName: string;
  status: "pending" | "verified" | "rejected" |"reviewing";
  description?: string;
  rejectionReason ?: string;
  isBlocked ?: boolean;
}
