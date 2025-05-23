import { myDataSource } from "../../../db/database";
import getExpiryTime from "../../../utils/helper/getExpiryTime";
import getHashedPassword from "../../../utils/helper/getHashedPassword";
import getOtp from "../../../utils/helper/getOtp";
import { AdminProfile } from "../adminProfile/adminProfile.entity";
import { UserAuthentication } from "../userAuthentication/user_authentication.entity";
import { UserProfile } from "../userProfile/userProfile.entity";
import { User } from "./user.entity";

const createUser = async (data: {
  email: string;
  fullName: string;
  password: string;
}) => {
  const result = await myDataSource.manager.transaction(
    async (transactionalEntityManager) => {
      const userProfile = transactionalEntityManager.create(UserProfile, {
        fullName: data.fullName,
        email: data.email,
      }); //if cascade true in user , no need to call save..

      const userAuth = transactionalEntityManager.create(UserAuthentication, {
        expDate: getExpiryTime(5),
        otp: getOtp(5).toString(),
        token: null,
      }); //if cascade true in user , no need to call save..

      const hashedPassword = await getHashedPassword(data.password);
      const user = transactionalEntityManager.create(User, {
        email: data.email,
        password: hashedPassword,
        userProfile: userProfile,
        authentication: userAuth,
      });

      // 5. Save user (cascades to save userProfile and authentication)

      const savedUser = await transactionalEntityManager.save(User, user);

      return { ...savedUser, password: "" };
    }
  );

  return result;
};

const updateProfileImage = async (path: string, email: string) => {};

const updateProfileData = async (
  userdata: Partial<AdminProfile> | Partial<UserProfile>,
  email: string
) => {};

export const UserService = {
  createUser,
  updateProfileImage,
  updateProfileData,
};
