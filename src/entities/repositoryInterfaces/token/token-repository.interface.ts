export interface ITokenRepository {
  tokenExists(token: string, userId: string): Promise<boolean>;
  deleteByTokenAndUserId(token: string, userId: string): Promise<void>;
  save(userId: string, token: string, expiry: Date): Promise<void>;
}
