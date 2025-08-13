import { inject, injectable } from "tsyringe";

import { PaginatedUsers } from "../../entities/modelsEntity/paginated-users.entity";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IGetAllUsersUsecase } from "../../entities/useCaseInterfaces/admin/get-all-users-usecase.interface";
import { HTTP_STATUS } from "../../shared/constants";
import { CustomError } from "../../shared/utils/error/customError";

@injectable()
export class GetAllUsersUsecase implements IGetAllUsersUsecase {
  constructor(
    @inject("IClientRepository")
    private clientRepository: IClientRepository,

    @inject("IVendorRepository")
    private vendorRepository: IVendorRepository
  ) {}

  async execute(
    userType: string,
    pageNumber: number,
    pageSize: number,
    searchTerm: string,
    status?: string
  ): Promise<PaginatedUsers> {
    const filter: any = {};

    if (searchTerm) {
      filter.$or = [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { agencyName: { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (userType) {
      filter.role = userType;
    }

    if (userType === "vendor" && status && status !== "all") {
      filter.status = status;
    }

    if (userType === "client" && status && status !== "all") {
      if (status === "active") {
        filter.isBlocked = false;
      } else if (status === "blocked") {
        filter.isBlocked = true;
      }
    }

    const validPageNumber = Math.max(1, pageNumber || 0);
    const validPageSize = Math.max(1, pageSize || 10);
    const skip = (validPageNumber - 1) * validPageSize;
    const limit = validPageSize;

    if (userType === "client") {
      const { user, total } = await this.clientRepository.find(
        filter,
        skip,
        limit
      );

      const response: PaginatedUsers = {
        user,
        total: Math.ceil(total / validPageSize),
      };
      return response;
    }

    if (userType === "vendor") {
      const { user, total } = await this.vendorRepository.find(
        filter,
        skip,
        limit
      );

      const response: PaginatedUsers = {
        user,
        total: Math.ceil(total / validPageSize),
      };
      return response;
    }

    throw new CustomError(
      HTTP_STATUS.BAD_REQUEST,
      "invalid user type ! expect client or vendor"
    );
  }
}
