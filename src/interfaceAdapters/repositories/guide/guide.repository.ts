import { injectable } from "tsyringe";
import { IGuideRepository } from "../../../entities/repositoryInterfaces/guide/guide-repository.interface";
import { IGuideEntity } from "../../../entities/modelsEntity/guide.entity";
import { guideDB } from "../../../frameworks/database/models/guide.model";

@injectable()
export class GuideRepository implements IGuideRepository{
   async findByEmail(email: string): Promise<IGuideEntity | null> {
        return await guideDB.findOne({email});
    }

    async findByNumber(phone: string): Promise<IGuideEntity | null> {
        return await guideDB.findOne({phone})
    }

    async save(data : Partial<IGuideEntity>) : Promise<IGuideEntity>{
        return await guideDB.create(data)
    }

    async findByIdAndUpdatePassword(guideId: string, password: string): Promise<IGuideEntity | null> {
        return await guideDB.findByIdAndUpdate(guideId,{password,status : "verified"});
    }
}