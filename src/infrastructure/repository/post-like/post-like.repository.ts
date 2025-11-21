import { injectable } from "tsyringe";

import { IPostLikeEntity } from "../../../domain/entities/post-like.entity";
import { IPostLikeRepository } from "../../../domain/repositoryInterfaces/post-like/post-like-repository.interface";
import { IPostLikeModel, postLikeDB } from "../../database/models/post-like.model";
import { BaseRepository } from "../baseRepository";

@injectable()
export class PostLikeRepository extends BaseRepository<IPostLikeModel,IPostLikeEntity> implements IPostLikeRepository {
  async save(data: IPostLikeEntity): Promise<IPostLikeEntity> {
    const like = new postLikeDB({
      userId: data.userId,
      postId: data.postId,
    });
    const saved = await like.save();
    return this.toEntity(saved);
  }

  async findById(id: string): Promise<IPostLikeEntity | null> {
    const like = await postLikeDB.findById(id).exec();
    return like ? this.toEntity(like) : null;
  }

  async findAll(): Promise<IPostLikeEntity[]> {
    const likes = await postLikeDB.find().exec();
    return likes.map((like) => this.toEntity(like));
  }

  async updateById(
    id: string,
    data: Partial<IPostLikeEntity>
  ): Promise<IPostLikeEntity | null> {
    const like = await postLikeDB
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    return like ? this.toEntity(like) : null;
  }

  async findByUserIdAndPostId(
    userId: string,
    postId: string
  ): Promise<IPostLikeEntity | null> {
    const like = await postLikeDB
      .findOne({
        userId,
        postId,
      })
      .exec();
    return like ? this.toEntity(like) : null;
  }

  async findByPostId(postId: string): Promise<IPostLikeEntity[]> {
    const likes = await postLikeDB.find({ postId }).exec();
    return likes.map((like) => this.toEntity(like));
  }

  async findByUserId(userId: string): Promise<IPostLikeEntity[]> {
    const likes = await postLikeDB.find({ userId }).exec();
    return likes.map((like) => this.toEntity(like));
  }

  async deleteByUserIdAndPostId(
    userId: string,
    postId: string
  ): Promise<boolean> {
    const result = await postLikeDB
      .deleteOne({
        userId,
        postId,
      })
      .exec();
    return result.deletedCount > 0;
  }

  async countByPostId(postId: string): Promise<number> {
    return await postLikeDB.countDocuments({ postId }).exec();
  }

  private toEntity(doc: IPostLikeModel): IPostLikeEntity {
    return {
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      postId: doc.postId.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}












