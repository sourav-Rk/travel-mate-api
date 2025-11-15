import { inject, injectable } from "tsyringe";

import { PaginatedUsers } from "../../../../domain/entities/paginated-users.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { USER_TYPES } from "../../../dto/request/admin.dto";
import { UserMapper } from "../../../mapper/user.mapper";
import { VendorMapper } from "../../../mapper/vendor.mapper";
import { IGetAllUsersUsecase } from "../../interfaces/admin/get-all-users-usecase.interface";

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

    if (userType === USER_TYPES.CLIENT) {
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

    if (userType ===USER_TYPES.VENDOR) {
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
      ERROR_MESSAGE.INVALID_USER_ROLE
    );
  }
}
