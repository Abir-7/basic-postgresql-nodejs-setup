import { myDataSource } from "../../../db/database";
import getHashedPassword from "../../../utils/helper/getHashedPassword";
import { IAdminProfile } from "../adminProfile/adminProfile.interface";
import { IUserProfile } from "../userProfile/userProfile.interface";
import { IBaseUser } from "./user.interface";

const createUser = async (data: {
  email: string;
  fullName: string;
  password: string;
}) => {
  const result = await myDataSource.manager.transaction(
    async (transactionalEntityManager) => {
      const hashedPassword = await getHashedPassword(data.password);
      const user = transactionalEntityManager.create("User", {
        email: data.email,
        password: hashedPassword,
      });

      const savedUser = (await transactionalEntityManager.save(
        "User",
        user
      )) as IBaseUser;

      const userProfile = transactionalEntityManager.create("UserProfile", {
        fullName: data.fullName,
        email: data.email,
        userId: savedUser?.id,
      });

      const savedProfile = await transactionalEntityManager.save(
        "UserProfile",
        userProfile
      );

      return {
        user: savedUser,
        userProfile: savedProfile,
      };
    }
  );

  return result;
};

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
