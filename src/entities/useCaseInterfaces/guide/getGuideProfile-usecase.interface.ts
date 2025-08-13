import { IGuideEntity } from "../../modelsEntity/guide.entity";

export interface IGetGuideProfileUsecase {
    execute(id : any) : Promise<IGuideEntity>;
}