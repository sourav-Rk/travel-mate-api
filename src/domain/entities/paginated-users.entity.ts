import { GuideListDto } from "../../application/dto/response/guideDto";
import { ClientDto, VendorDto } from "../../application/dto/response/user.dto";

export interface PaginatedUsers {
  user: ClientDto[] | VendorDto[] | GuideListDto[] | [];
  total: number;
}
