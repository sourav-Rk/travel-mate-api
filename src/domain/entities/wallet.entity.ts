import { TRole } from "../../shared/constants";

export interface IWalletEntity {
  _id: string;
  userId: string;
  userType: TRole;
  balance: number;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}
