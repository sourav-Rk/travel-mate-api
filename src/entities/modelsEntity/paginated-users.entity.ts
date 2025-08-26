import { GuideListDto } from "../../shared/dto/guideDto";
import { ClientDto, VendorDto } from "../../shared/dto/user.dto";

export interface PaginatedUsers {
    user : ClientDto[] | VendorDto[] | GuideListDto[] | [];
    total : number;
}