import status from "http-status";
import { myDataSource } from "../../../db/database";
import AppError from "../../../errors/AppError";
import { removeFalsyFields } from "../../../utils/helper/removeFalsyField";
import { User } from "../user/user.entity";
import { UserProfile } from "./userProfile.entity";
import unlinkFile from "../../../utils/unlinkFiles";
import { getRelativePath } from "../../../middlewares/fileUpload/getRelativeFilePath";
import { error } from "winston";

const updateProfileImage = async (path: string, email: string) => {
  if (!path) {
    throw new AppError(status.NOT_FOUND, "Image not found");
  }

  return await myDataSource
    .transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const userInfo = await userRepo.findOne({ where: { email } });

      if (!userInfo?.userProfile) {
        throw new AppError(status.NOT_FOUND, "User not found");
      }
      const image = getRelativePath(path);
      const oldImage = userInfo.userProfile.image;

      userInfo.userProfile.image = image;

      await manager.save(userInfo.userProfile);

      if (oldImage) {
        unlinkFile(oldImage);
      }

      return userInfo.userProfile;
    })
    .catch(async (error) => {
      if (path) unlinkFile(getRelativePath(path));
      throw new Error(error);
    });
};

const updateProfileData = async (
  profileData: Partial<UserProfile>,
  id: string
) => {
  const userRepo = myDataSource.getRepository(User);
  const userProfileRepo = myDataSource.getRepository(UserProfile);

  // Get the user with profile
  const user = await userRepo.findOne({ where: { id } });

  if (!user?.userProfile?.id) {
    throw new AppError(status.NOT_FOUND, "User or user profile not found");
  }

  // Clean empty fields from input
  const cleanedProfile = removeFalsyFields(profileData);

  // Update the profile directly
  const updatedProfile = await userProfileRepo.preload({
    id: user.userProfile.id,
    ...cleanedProfile,
  });

  return updatedProfile;
};

export const UserProfileService = { updateProfileData, updateProfileImage };
