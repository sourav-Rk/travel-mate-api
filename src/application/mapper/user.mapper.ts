import { IClientEntity } from "../../domain/entities/client.entity";
import { IClientModel } from "../../infrastructure/database/models/client.model";
import { ClientDto } from "../dto/response/user.dto";

export class UserMapper {
  static toEntity(doc: IClientModel): IClientEntity {
    const user: IClientEntity = {
      _id: String(doc._id),
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      phone: doc.phone,
      password: doc.password,
      gender: doc.gender,
      role: doc.role,
      profileImage: doc.profileImage,
      isBlocked: doc.isBlocked,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };

    if (doc.googleId) {
      user.googleId = doc.googleId;
    }

    if (doc.bio) {
      user.bio = doc.bio;
    }

    return user;
  }

  static mapUserToAdminTableDto(doc: IClientEntity): ClientDto {
    return {
      _id: doc._id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      phone: doc.phone,
      profileImage: doc.profileImage,
      role: doc.role as "client",
      isBlocked: doc.isBlocked,
    };
  }
}
