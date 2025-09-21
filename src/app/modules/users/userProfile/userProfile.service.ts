import status from "http-status";

import AppError from "../../../errors/AppError";
import { removeFalsyFields } from "../../../utils/helper/removeFalsyField";
import unlinkFile from "../../../middlewares/fileUpload/unlinkFiles";
import { getRelativePath } from "../../../middlewares/fileUpload/getRelativeFilePath";

import { eq } from "drizzle-orm";
import { User } from "../../../db/schema/user.schema";
import { db } from "../../../db";
import { UserProfile } from "../../../db/schema/userProfile.schema";

const updateProfileImage = async (path: string, email: string) => {
  if (!path) {
    throw new AppError(status.NOT_FOUND, "Image not found");
  }

  return await db
    .transaction(async (tx) => {
      // 1. Find user with profile by email
      const [userWithProfile] = await tx
        .select({
          userId: User.id,
          profileId: UserProfile.id,
          oldImage: UserProfile.image,
        })
        .from(User)
        .leftJoin(UserProfile, eq(User.id, UserProfile.user_id))
        .where(eq(User.email, email));

      if (!userWithProfile || !userWithProfile.profileId) {
        throw new AppError(status.NOT_FOUND, "User not found");
      }

      // 2. Prepare new image path
      const image = getRelativePath(path);
      const oldImage = userWithProfile.oldImage;

      // 3. Update profile image
      await tx
        .update(UserProfile)
        .set({ image })
        .where(eq(UserProfile.id, userWithProfile.profileId));

      // 4. Delete old image file if exists
      if (oldImage) {
        unlinkFile(oldImage);
      }

      // 5. Return updated profile info (optional: fetch updated row)
      const [updatedProfile] = await tx
        .select()
        .from(UserProfile)
        .where(eq(UserProfile.id, userWithProfile.profileId));

      return updatedProfile;
    })
    .catch((error: any) => {
      if (path) unlinkFile(getRelativePath(path));
      throw new Error(error);
    });
};

const updateProfileData = async (
  profileData: Partial<typeof UserProfile>,
  userId: string
) => {
  // 1. Find profile by userId
  const [profile] = await db
    .select()
    .from(UserProfile)
    .where(eq(UserProfile.user_id, `${userId}`));

  if (!profile) {
    throw new AppError(status.NOT_FOUND, "User profile not found");
  }

  // 2. Remove falsy fields from input
  const cleanedProfile = removeFalsyFields(profileData);

  // 3. Update profile
  await db
    .update(UserProfile)
    .set(cleanedProfile)
    .where(eq(UserProfile.id, profile.id));

  // 4. Return updated profile (optional)
  const [updatedProfile] = await db
    .select()
    .from(UserProfile)
    .where(eq(UserProfile.id, profile.id));

  return updatedProfile;
};

export const UserProfileService = { updateProfileData, updateProfileImage };
