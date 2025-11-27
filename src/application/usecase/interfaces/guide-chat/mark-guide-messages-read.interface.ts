export interface IMarkGuideMessagesReadUsecase {
  execute(guideChatRoomId: string, userId: string): Promise<string[]>;
}

















