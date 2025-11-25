import { Request, Response } from "express";

export interface IVendorSalesReportController {
  getSalesReport(req: Request, res: Response): Promise<void>;
}






















