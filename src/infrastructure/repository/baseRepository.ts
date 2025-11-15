import { Document, Model } from "mongoose";

import { IBaseRepository } from "../../domain/repositoryInterfaces/baseRepository.interface";

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
    return this.toDomain ? this.toDomain(doc) : (doc as unknown as TEntity);
  }

  async save(data: Partial<TEntity>): Promise<TEntity> {
    const modelData = this.toModel
      ? this.toModel(data)
      : (data as Partial<TDoc>);
    const doc = await this.model.create(modelData);
    return this.toDomain ? this.toDomain(doc) : (doc as unknown as TEntity);
  }

  async updateById(
    id: string,
    data: Partial<TEntity>
  ): Promise<TEntity | null> {
    const modelData = this.toModel
      ? this.toModel(data)
      : (data as Partial<TDoc>);
    const doc = await this.model
      .findByIdAndUpdate(id, modelData, { new: true })
      .exec();

    if (!doc) return null;
    return this.toDomain ? this.toDomain(doc) : (doc as unknown as TEntity);
  }

  async deleteById(id: string): Promise<TEntity | null> {
    const doc = await this.model.findByIdAndDelete(id).exec();
    if (!doc) return null;
    return this.toDomain ? this.toDomain(doc) : (doc as unknown as TEntity);
  }
}
