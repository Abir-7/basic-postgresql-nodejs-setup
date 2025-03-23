import { IBaseUser } from "../user/user.interface";

export interface IUserAuthentication {
  expDate: Date;
  otp: number;
  token: string;
  id: string;
  userId: string;
  user: IBaseUser;
}
