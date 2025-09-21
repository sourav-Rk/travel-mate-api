import { injectable } from "tsyringe";
import { ITokenRepository } from "../../../entities/repositoryInterfaces/token/token-repository.interface";
import { tokenDB } from "../../../frameworks/database/models/token.model";

@injectable()
export class TokenRepository implements ITokenRepository {
  async save(userId: string, token: string, expiry: Date): Promise<void> {
    await tokenDB.create({ userId, token, expiry });
    console.log("token saved");
  }

  async tokenExists(token: string, userId: string): Promise<boolean> {
    const data = await tokenDB.findOne({ token, userId });
    return data ? true : false;
  }

  async deleteByTokenAndUserId(token: string, userId: string): Promise<void> {
    await tokenDB.findOneAndDelete({ token, userId });
    console.log("token deleted");
  }
}
