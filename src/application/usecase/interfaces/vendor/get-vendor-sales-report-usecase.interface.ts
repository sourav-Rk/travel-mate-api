import { VENDOR_SALES_REPORT_PERIOD } from "../../../dto/request/vendor-sales-report.dto";
import { VendorSalesReportDto } from "../../../dto/response/vendor-sales-report.dto";

export interface IGetVendorSalesReportUsecase {
  execute(
    vendorId: string,
    period?: VENDOR_SALES_REPORT_PERIOD,
    startDate?: string,
    endDate?: string,
    packageId?: string,
    bookingStatus?: string,
  ): Promise<VendorSalesReportDto>;
}





















