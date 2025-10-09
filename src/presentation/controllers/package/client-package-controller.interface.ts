import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IClientPackageController } from "../../interfaces/controllers/package/client-package.controller";
import { IGetTrendingPackagesUsecase } from "../../../application/usecase/interfaces/package/client-package/get-trending-packages.usecase";
import { IGetAvailablePackagesUsecase } from "../../../application/usecase/interfaces/package/client-package/getAvailable-package-usecase.interface";
import { IGetFeaturedPackagesUsecase } from "../../../application/usecase/interfaces/package/client-package/getFeaturedPackages-usecase.interface";
import { IGetPackageDetailsClientUsecase } from "../../../application/usecase/interfaces/package/client-package/getPackageDetailsClient-usecase.interface";
import { HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class ClientPackageController implements IClientPackageController {
  constructor(
    @inject("IGetAvailablePackagesUsecase")
    private _getAvailablePackageUsecase: IGetAvailablePackagesUsecase,

    @inject("IGetPackageDetailsClientUsecase")
    private _getPackageDetailsClientUsecase: IGetPackageDetailsClientUsecase,

    @inject("IGetFeaturedPackagesUsecase")
    private _getFeaturedPackagesUsecase: IGetFeaturedPackagesUsecase,

    @inject("IGetTrendingPackagesUsecase")
    private _getTrendingPackages: IGetTrendingPackagesUsecase
  ) {}

  async getAvailablePackages(req: Request, res: Response): Promise<void> {
    console.log(req.query)
    const {
      page = "1",
      limit = "10",
      search = "",
      priceRange,
      duration = "",
      sortBy = "createdAt",
    } = req.query as {
      page?: string;
      limit?: string;
      search?: string;
      priceRange?: string[] | string;
      duration?: string;
      sortBy?: string;
    };

    let categories: string[] = [];

    if (req.query.categories) {
      const category = req.query.categories;
      categories = Array.isArray(category)
        ? category.map(String)
        : [String(category)];
    }

    const parsedPriceRange: number[] = [];
    if (priceRange) {
      const range = Array.isArray(priceRange) ? priceRange : [priceRange];
      parsedPriceRange.push(...range.map(Number));
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const { packages, total } = await this._getAvailablePackageUsecase.execute(
      search,
      categories,
      parsedPriceRange,
      duration,
      pageNumber,
      pageSize,
      sortBy
    );
    res.status(HTTP_STATUS.OK).json({
      success: true,
      packages,
      totalPages: total,
      currentPage: pageNumber,
    });
  }

  async getFeaturedPackages(req: Request, res: Response): Promise<void> {
    const packageId = req.params.packageId;

    if (typeof packageId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid package ID",
      });
      return;
    }
    const response = await this._getFeaturedPackagesUsecase.execute(packageId);
    res.status(HTTP_STATUS.OK).json({ success: true, packages: response });
  }

  async getPackageDetails(req: Request, res: Response): Promise<void> {
    const { packageId } = req.params;
    const response = await this._getPackageDetailsClientUsecase.execute(
      packageId
    );
    res.status(HTTP_STATUS.OK).json({ success: true, packages: response });
  }

  async getTrendingPackages(req: Request, res: Response): Promise<void> {
    const packages = await this._getTrendingPackages.execute();
    res.status(200).json({ success: true, packages });
  }
}
