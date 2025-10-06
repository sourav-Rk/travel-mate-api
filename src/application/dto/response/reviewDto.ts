import { IClientEntity } from "../../../domain/entities/client.entity";

export interface ReviewListWithUserDetailsDto {
  _id: string;
  userId: IClientEntity;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ReviewListDto {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  rating: number;
  comment: string;
  createdAt: Date;
}
