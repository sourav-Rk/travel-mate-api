import { BOOKINGSTATUS } from "../../shared/constants";

export interface IBookingEntity {
  _id?: string;
  bookingId : string;
  userId: string;
  packageId: string;
  status: BOOKINGSTATUS;
  advancePayment?: {
    amount: number;
    paid: boolean;
    dueDate: Date;
    paidAt: Date | null;
  };
  fullPayment?: {
    amount: number;
    paid: boolean;
    dueDate: Date;
    paidAt: Date | null;
  };
  isWaitlisted?: boolean;
  appliedAt?: Date;
  cancelledAt?: Date;
}
