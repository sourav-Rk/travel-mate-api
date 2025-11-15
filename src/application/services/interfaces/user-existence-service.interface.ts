import { IUserEntity } from "../../../domain/entities/user.entity";

export interface IUserExistenceService {
  emailExists(email: string): Promise<boolean>;
  getUserAndRoleByEmail(
    email: string
  ): Promise<{ user: IUserEntity | null; role: string } | null>;
}
