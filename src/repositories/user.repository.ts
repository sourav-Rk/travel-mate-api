import { User } from "../models/user.model";
import { IUser, RegisterUserDTO } from "../types/user.types";


export class UserRepository {
  async create(userData: RegisterUserDTO): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }


  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async findByIdWithoutPassword(
    id: string
  ): Promise<Omit<IUser, "password"> | null> {
    return User.findById(id).select("-password");
  }


  async existsByEmail(email: string): Promise<boolean> {
    const user = await User.findOne({ email }).select("_id");
    return user !== null;
  }
}
