import { IAdminProfile } from "../adminProfile/adminProfile.interface";
import { IUserProfile } from "../userProfile/userProfile.interface";

const createUser = async (data: {
  email: string;
  fullName: string;
  password: string;
}) => {};

const updateProfileImage = async (path: string, email: string) => {};

const updateProfileData = async (
  userdata: Partial<IAdminProfile> | Partial<IUserProfile>,
  email: string
) => {};

export const UserService = {
  createUser,
  updateProfileImage,
  updateProfileData,
};
