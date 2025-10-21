import { TRole } from "../../../../shared/constants";
import { GetWalletDto } from "../../../dto/response/walletDto";

export interface IGetWalletByUserIdUsecase{
    execute(userId : string,role : TRole) : Promise<GetWalletDto>;
}