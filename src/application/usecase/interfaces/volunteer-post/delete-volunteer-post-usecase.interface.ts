export interface IDeleteVolunteerPostUsecase {
  execute(userId: string, postId: string): Promise<void>;
}

