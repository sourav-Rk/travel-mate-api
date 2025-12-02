import { Post } from "../models/post.model";
import {
  IPost,
  IPostPopulated,
  CreatePostDTO,
  UpdatePostDTO,
} from "../types/post.types";
import { IUser } from "../types/user.types";

export class PostRepository {
  async create(postData: CreatePostDTO): Promise<IPost> {
    const post = new Post(postData);
    return post.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{ posts: IPostPopulated[]; total: number }> {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .populate<{ author: IUser }>("author", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() as Promise<IPostPopulated[]>,
      Post.countDocuments(),
    ]);

    return { posts, total };
  }

  /**
   * Finds a post by ID with populated author
   */
  async findById(id: string): Promise<IPostPopulated | null> {
    return Post.findById(id)
      .populate("author", "name email")
      .lean() as Promise<IPostPopulated | null>;
  }

  async findByIdRaw(id: string): Promise<IPost | null> {
    return Post.findById(id);
  }

  /**
   * Finds all posts by a specific author with pagination
   */
  async findByAuthor(
    authorId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ posts: IPostPopulated[]; total: number }> {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ author: authorId })
        .populate<{ author: IUser }>("author", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() as Promise<IPostPopulated[]>,
      Post.countDocuments({ author: authorId }),
    ]);

    return { posts, total };
  }

  /**
   * Updates a post by ID
   */
  async update(
    id: string,
    updateData: UpdatePostDTO
  ): Promise<IPostPopulated | null> {
    return Post.findByIdAndUpdate(id, updateData, { new: true })
      .populate("author", "name email")
      .lean() as Promise<IPostPopulated | null>;
  }

  /**
   * Deletes a post by ID
   */
  async delete(id: string): Promise<IPost | null> {
    return Post.findByIdAndDelete(id);
  }

  /**
   * Checks if a post exists
   */
  async exists(id: string): Promise<boolean> {
    const post = await Post.findById(id).select("_id");
    return post !== null;
  }
}
