export interface IMarkReadUsecase {
  execute(chatRoomId: string, userId: string): Promise<{messageIds : string[]}>;
}
