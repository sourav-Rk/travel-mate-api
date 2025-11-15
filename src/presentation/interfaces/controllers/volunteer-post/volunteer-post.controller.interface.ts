import { Request, Response } from "express";

export interface IVolunteerPostController {
  createPost(req: Request, res: Response): Promise<void>;
  updatePost(req: Request, res: Response): Promise<void>;
  deletePost(req: Request, res: Response): Promise<void>;
  getPost(req: Request, res: Response): Promise<void>;
  getPosts(req: Request, res: Response): Promise<void>;
  getPostsByLocation(req: Request, res: Response): Promise<void>;
  searchPosts(req: Request, res: Response): Promise<void>;
  likePost(req: Request, res: Response): Promise<void>;
  unlikePost(req: Request, res: Response): Promise<void>;
}

