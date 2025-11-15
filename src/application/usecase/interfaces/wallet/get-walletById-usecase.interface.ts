import { GetWalletDto } from "../../../dto/response/walletDto";

export interface IGetWalletByIdUsecase {
  execute(walletId: string): Promise<GetWalletDto>;
}
