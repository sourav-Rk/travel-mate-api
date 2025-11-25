export interface IDeleteBadgeUsecase {
  execute(badgeId: string): Promise<boolean>;
}





