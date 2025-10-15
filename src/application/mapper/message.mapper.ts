import { plainToInstance } from "class-transformer";
import { IMessageEntity } from "../../domain/entities/message.entity";
import { IMessageModel } from "../../infrastructure/database/models/message.model";
import { MessageResDTO } from "../dto/response/messageDto";

export class MessageMapper {
   static toEntity(doc : IMessageModel) : IMessageEntity{
      return plainToInstance(MessageResDTO,doc.toObject(),{
        excludeExtraneousValues : true
      })
   } 
}