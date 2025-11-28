import { IPostLikeEntity } from "../../entities/post-like.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IPostLikeRepository extends IBaseRepository<IPostLikeEntity> {
  findByUserIdAndPostId(
    userId: string,
    postId: string
  ): Promise<IPostLikeEntity | null>;

  findByPostId(postId: string): Promise<IPostLikeEntity[]>;

  findByUserId(userId: string): Promise<IPostLikeEntity[]>;

  deleteByUserIdAndPostId(
    userId: string,
    postId: string
  ): Promise<boolean>;
  

  countByPostId(postId: string): Promise<number>;
}



















