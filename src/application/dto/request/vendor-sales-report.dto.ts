import { IsEnum, IsOptional, IsString } from "class-validator";
import { BOOKINGSTATUS } from "../../../shared/constants";

export type VENDOR_SALES_REPORT_PERIOD = "daily" | "weekly" | "monthly" | "yearly" | "custom";

export class GetVendorSalesReportReqDTO {
  @IsOptional()
  @IsEnum(["daily", "weekly", "monthly", "yearly", "custom"])
  period?: VENDOR_SALES_REPORT_PERIOD;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  packageId?: string;

  @IsOptional()
  @IsEnum(BOOKINGSTATUS)
  bookingStatus?: BOOKINGSTATUS;

  @IsOptional()
  @IsString()
  paymentMode?: string;
}














