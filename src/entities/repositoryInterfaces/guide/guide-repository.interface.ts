import { IGuideEntity } from "../../modelsEntity/guide.entity";

export interface IGuideRepository {
  findByEmail(email: string): Promise<IGuideEntity | null>;
  findByNumber(phone: string): Promise<IGuideEntity | null>;
  save(data : Partial<IGuideEntity>) : Promise<IGuideEntity>;
  findByIdAndUpdatePassword(id : any,password : string) : Promise<IGuideEntity | null>
}
