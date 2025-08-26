import { inject, injectable } from "tsyringe";

import { PaginatedUsers } from "../../entities/modelsEntity/paginated-users.entity";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IGetAllUsersUsecase } from "../../entities/useCaseInterfaces/admin/get-all-users-usecase.interface";
import { UserMapper } from "../../interfaceAdapters/mappers/user.mapper";
import { VendorMapper } from "../../interfaceAdapters/mappers/vendor.mapper";
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
    const validPageNumber = Math.max(1, pageNumber || 0);
    const validPageSize = Math.max(1, pageSize || 10);

    if (userType === "client") {
      const { user, total } = await this.clientRepository.find(
        searchTerm,
        status ?? "all",
        userType,
        validPageNumber,
        validPageSize
      );

      const users = user.map((doc) => UserMapper.mapUserToAdminTableDto(doc));

      const response: PaginatedUsers = {
        user: users,
        total: Math.ceil(total / validPageSize),
      };
      return response;
    }

    if (userType === "vendor") {
      const { user, total } = await this.vendorRepository.find(
        searchTerm,
        status ?? "all",
        userType,
        validPageNumber,
        validPageSize
      );

      const users = user.map((doc) =>
        VendorMapper.mapVendorToAdminTableDto(doc)
      );

      const response: PaginatedUsers = {
        user: users,
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
