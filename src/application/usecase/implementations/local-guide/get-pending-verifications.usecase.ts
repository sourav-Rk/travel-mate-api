import { inject, injectable } from "tsyringe";

import { PendingVerificationsResponseDto } from "../../../../application/dto/response/local-guide.dto";
import { LocalGuideProfileMapper } from "../../../../application/mapper/local-guide-profile.mapper";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { TVerificationStatus } from "../../../../shared/constants";
import { IGetPendingVerificationsUsecase } from "../../interfaces/local-guide/get-pending-verifications-usecase.interface";

@injectable()
export class GetPendingVerificationsUsecase
  implements IGetPendingVerificationsUsecase
{
  constructor(
    @inject("ILocalGuideProfileRepository")
    private _localGuideProfileRepository: ILocalGuideProfileRepository
  ) {}

  async execute(
    status: TVerificationStatus,
    page: number,
    limit: number,
    searchTerm?: string
  ): Promise<PendingVerificationsResponseDto> {
    const result = await this._localGuideProfileRepository.findByVerificationStatus(
      status,
      page,
      limit,
      searchTerm
    );

    return {
      profiles: result.profiles.map((profile) =>
        LocalGuideProfileMapper.toDto(profile.entity, profile.userDetails)
      ),
      total: result.total,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }
}

