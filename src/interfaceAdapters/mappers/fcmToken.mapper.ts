import { IFCMTokenEntity } from "../../entities/modelsEntity/fcmToken.entity";
import { IFcmTokenModel } from "../../frameworks/database/models/fcmToken.model";

export class FcmTokenMapper{
    static toEntity(doc : IFcmTokenModel) : IFCMTokenEntity{
        return {
            _id : String(doc._id),
            userId : String(doc.userId),
            token : doc.token,
            createdAt : doc.createdAt
        }
    }
}