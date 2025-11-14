import { PendingVerificationsResponseDto } from "../../../../application/dto/response/local-guide.dto";
import { TVerificationStatus } from "../../../../shared/constants";

export interface IGetPendingVerificationsUsecase {
  execute(
    status: TVerificationStatus,
    page: number,
    limit: number,
    searchTerm?: string
  ): Promise<PendingVerificationsResponseDto>;
}

