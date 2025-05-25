import status from "http-status";
import { myDataSource } from "../../../db/database";
import AppError from "../../../errors/AppError";
import { removeFalsyFields } from "../../../utils/helper/removeFalsyField";
import { User } from "../user/user.entity";
import { UserProfile } from "./userProfile.entity";

const updateProfileImage = async (path: string, email: string) => {};

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
