export interface IMarkGuideMessagesDeliveredUsecase {
  execute(guideChatRoomId: string, userId: string): Promise<string[]>;
}
















