export interface ILikeVolunteerPostUsecase {
  execute(userId: string, postId: string): Promise<void>;
}
















