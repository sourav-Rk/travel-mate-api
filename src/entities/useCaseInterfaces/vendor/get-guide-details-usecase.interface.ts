import { IGuideEntity } from "../../modelsEntity/guide.entity";

export interface IGetGuideDetailsUsecase{
    execute(vendorId : any,id : any) : Promise<IGuideEntity>;
}