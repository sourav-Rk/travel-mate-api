import { Document, Model } from "mongoose";
import { IBaseRepository } from "../../entities/repositoryInterfaces/baseRepository.interface";

export class BaseRepository<TDoc extends Document, TEntity>
  implements IBaseRepository<TEntity>
{
  private model: Model<TDoc>;
  private toDomain?: (doc: TDoc) => TEntity;
  private toModel?: (data: Partial<TEntity>) => Partial<TDoc>;

  constructor(
    model: Model<TDoc>,
    toDomain?: (doc: TDoc) => TEntity,
    toModel?: (data: Partial<TEntity>) => Partial<TDoc>
  ) {
    this.model = model;
    this.toDomain = toDomain;
    this.toModel = toModel;
  }

  async findById(id: string): Promise<TEntity | null> {
    const doc = await this.model.findById(id).exec();
    if (!doc) return null;
    return this.toDomain ? this.toDomain(doc) : (doc as any);
  }

  async save(data: Partial<TEntity>): Promise<TEntity> {
    const doc = await this.model.create(
      this.toModel ? this.toModel(data) : (data as any)
    );
    return this.toDomain ? this.toDomain(doc) : (data as any);
  }

 async updateById(
    id: string,
    data: Partial<TEntity>
  ): Promise<TEntity | null> {
    const doc = await this.model
      .findByIdAndUpdate(
        id,
        this.toModel ? this.toModel(data) : (data as any),
        { new: true }
      )
      .exec();

    if (!doc) return null;
    return this.toDomain ? this.toDomain(doc) : (doc as any);
  }

  async deleteById(id: string): Promise<TEntity | null> {
    const doc = await this.model.findByIdAndDelete(id).exec();
    if (!doc) return null;
    return this.toDomain ? this.toDomain(doc) : (doc as any);
  }
}


