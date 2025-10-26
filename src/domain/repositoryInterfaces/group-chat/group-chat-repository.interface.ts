import { USER_TYPES } from "../../../application/dto/request/admin.dto";
import { GroupChatDetailsQueryDto } from "../../../application/dto/response/groupChatDto";
import { IGroupChatEntity } from "../../entities/group-chat.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IGroupChatRepository extends IBaseRepository<IGroupChatEntity>{
   findByPackage(packageId: string): Promise<IGroupChatEntity | null>;
   findByUserId(userId : string,searchTerm?:string) : Promise<IGroupChatEntity[]>;
   addMember(groupId : string, member:{userId : string;userType : USER_TYPES}):Promise<void>;
   getGroupWithMemberDetails(groupChatId: string): Promise<GroupChatDetailsQueryDto>
} 