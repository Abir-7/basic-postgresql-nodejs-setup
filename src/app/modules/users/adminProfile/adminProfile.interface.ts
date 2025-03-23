import { IBaseUser } from "../user/user.interface";

export interface IAdminProfile {
  fullName: string;
  nickname?: string;
  dateOfBirth?: Date;
  email: string;
  phone?: string;
  address?: string;
  image?: string;
  userId: string; // id
  user: IBaseUser;
}
