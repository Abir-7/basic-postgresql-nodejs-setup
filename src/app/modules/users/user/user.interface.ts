import { TUserRole } from "../../../interface/auth.interface";
import { IAdminProfile } from "../adminProfile/adminProfile.interface";
import { IUserAuthentication } from "../userAuthentication/user_authentication.interface";
import { IUserProfile } from "../userProfile/userProfile.interface";

export interface IBaseUser {
  id: string;
  email: string;
  role: TUserRole;
  password: string;
  isVerified: boolean;
  needToResetPass: boolean;
  createdAt: Date;
  updatedAt: Date;
  authentication: IUserAuthentication;
  adminProfile: IAdminProfile;
  userProfile: IUserProfile;
}
