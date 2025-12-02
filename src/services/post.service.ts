import { PostRepository } from "../repositories/post.repository";
import { S3Service } from "./s3.service";
import { AppError } from "../utils/AppError";
import {
  CreatePostDTO,
  UpdatePostDTO,
  PostResponse,
  IPostPopulated,
} from "../types/post.types";
import { ERROR_MESSAGES, HTTP_STATUS } from "../shared/constants";
import { UserRepository } from "../repositories/user.repository";

interface PaginatedPosts {
  posts: PostResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export class PostService {
  private readonly _postRepository: PostRepository;
  private readonly _s3Service: S3Service;
  private readonly _userRepository: UserRepository;

  constructor(
    _postRepository: PostRepository,
    _s3Service: S3Service,
    _userRepository: UserRepository
  ) {
    this._postRepository = _postRepository;
    this._s3Service = _s3Service;
    this._userRepository = _userRepository;
  }

  async createPost(
    title: string,
    content: string,
    file: Express.Multer.File,
    authorId: string
  ): Promise<PostResponse> {
    const user = await this._userRepository.findById(authorId);
    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const { url, key } = await this._s3Service.uploadImage(file);

    const postData: CreatePostDTO = {
      title,
      content,
      imageUrl: url,
      imageKey: key,
      author: authorId,
    };

    const post = await this._postRepository.create(postData);

    const populatedPost = await this._postRepository.findById(
      post._id.toString()
    );
    if (!populatedPost) {
      throw new AppError(ERROR_MESSAGES.POSTS.FAILED_TO_CREATE_POST, 500);
    }

    return this.formatPostResponse(populatedPost);
  }

  async getAllPosts(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedPosts> {
    const { posts, total } = await this._postRepository.findAll(page, limit);
    const totalPages = Math.ceil(total / limit);

    return {
      posts: posts.map((post) => this.formatPostResponse(post)),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  async getPostById(id: string): Promise<PostResponse> {
    const post = await this._postRepository.findById(id);
    if (!post) {
      throw new AppError(
        ERROR_MESSAGES.POSTS.POST_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return this.formatPostResponse(post);
  }

  async getPostsByAuthor(
    authorId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedPosts> {
    const { posts, total } = await this._postRepository.findByAuthor(
      authorId,
      page,
      limit
    );
    const totalPages = Math.ceil(total / limit);

    return {
      posts: posts.map((post) => this.formatPostResponse(post)),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  async updatePost(
    postId: string,
    userId: string,
    updateData: { title?: string; content?: string },
    file?: Express.Multer.File
  ): Promise<PostResponse> {
    const existingPost = await this._postRepository.findByIdRaw(postId);
    if (!existingPost) {
      throw new AppError(ERROR_MESSAGES.POSTS.POST_NOT_FOUND, 404);
    }

    if (existingPost.author.toString() !== userId) {
      throw new AppError(
        ERROR_MESSAGES.POSTS.NOT_AUTHORIZED_TO_UPDATE_POST,
        403
      );
    }

    const updatePayload: UpdatePostDTO = {};

    if (updateData.title) {
      updatePayload.title = updateData.title;
    }

    if (updateData.content) {
      updatePayload.content = updateData.content;
    }

    if (file) {
      const { url, key } = await this._s3Service.uploadImage(file);
      updatePayload.imageUrl = url;
      updatePayload.imageKey = key;

      await this._s3Service.deleteImage(existingPost.imageKey);
    }

    const updatedPost = await this._postRepository.update(
      postId,
      updatePayload
    );
    if (!updatedPost) {
      throw new AppError(
        ERROR_MESSAGES.POSTS.FAILED_TO_UPDATE_POST,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    return this.formatPostResponse(updatedPost);
  }

  async deletePost(postId: string, userId: string): Promise<void> {
    const existingPost = await this._postRepository.findByIdRaw(postId);
    if (!existingPost) {
      throw new AppError(ERROR_MESSAGES.POSTS.POST_NOT_FOUND, 404);
    }

    if (existingPost.author.toString() !== userId) {
      throw new AppError(
        ERROR_MESSAGES.POSTS.NOT_AUTHORIZED_TO_DELETE_POST,
        HTTP_STATUS.FORBIDDEN
      );
    }

    await this._s3Service.deleteImage(existingPost.imageKey);
    await this._postRepository.delete(postId);
  }

  private formatPostResponse(post: IPostPopulated): PostResponse {
    return {
      _id: post._id.toString(),
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      author: {
        _id: post.author._id.toString(),
        name: post.author.name,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
