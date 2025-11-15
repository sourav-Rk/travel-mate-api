export interface IUnlikeVolunteerPostUsecase {
  execute(userId: string, postId: string): Promise<void>;
}


