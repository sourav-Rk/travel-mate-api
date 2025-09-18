import { PackageStatus } from "../../shared/constants";

export interface IPackageEntity {
  _id : string;
  packageId ?: string;
  agencyId: string;
  packageName: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  status?: PackageStatus;
  meetingPoint: string;
  images: string[];
  maxGroupSize: number;
  price: number;
  cancellationPolicy: string;
  termsAndConditions: string;
  inclusions: string[];
  exclusions: string[];
  startDate: Date;
  endDate: Date;
  duration: {
    nights: number;
    days: number;
  };
  isBlocked ?: boolean;
  itineraryId?: string;
  minGroupSize : number;
  applicationDeadline ?: Date;
  advancePaymentDeadlineDays ?: number;
  fullPaymentDeadlineDays ?: number;
  paymentAlertSentAt ?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
