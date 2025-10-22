import { IGroupChatEntity } from "../../entities/group-chat.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IGroupChatRepository extends IBaseRepository<IGroupChatEntity>{
   findByPackage(packageId: string): Promise<IGroupChatEntity | null>;
   updateById(id: string, data: Partial<IGroupChatEntity>): Promise<IGroupChatEntity | null>;
} 