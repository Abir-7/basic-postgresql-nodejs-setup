import status from "http-status";

import AppError from "../../../errors/AppError";
import { removeFalsyFields } from "../../../utils/helper/removeFalsyField";
import unlinkFile from "../../../utils/unlinkFiles";
import { getRelativePath } from "../../../middlewares/fileUpload/getRelativeFilePath";

import { eq } from "drizzle-orm";
import { users } from "../../../db/schema/user.schema";
import { db } from "../../../db/db";
import { userProfile } from "../../../db/schema/userProfile.schema";

const updateProfileImage = async (path: string, email: string) => {
  if (!path) {
    throw new AppError(status.NOT_FOUND, "Image not found");
  }

  return await db
    .transaction(async (tx) => {
      // 1. Find user with profile by email
      const [userWithProfile] = await tx
        .select({
          userId: users.id,
          profileId: userProfile.id,
          oldImage: userProfile.image,
        })
        .from(users)
        .leftJoin(userProfile, eq(users.id, userProfile.userId))
        .where(eq(users.email, email));

      if (!userWithProfile || !userWithProfile.profileId) {
        throw new AppError(status.NOT_FOUND, "User not found");
      }

      // 2. Prepare new image path
      const image = getRelativePath(path);
      const oldImage = userWithProfile.oldImage;

      // 3. Update profile image
      await tx
        .update(userProfile)
        .set({ image })
        .where(eq(userProfile.id, userWithProfile.profileId));

      // 4. Delete old image file if exists
      if (oldImage) {
        unlinkFile(oldImage);
      }

      // 5. Return updated profile info (optional: fetch updated row)
      const [updatedProfile] = await tx
        .select()
        .from(userProfile)
        .where(eq(userProfile.id, userWithProfile.profileId));

      return updatedProfile;
    })
    .catch((error: any) => {
      if (path) unlinkFile(getRelativePath(path));
      throw new Error(error);
    });
};

const updateProfileData = async (
  profileData: Partial<typeof userProfile>,
  userId: string
) => {
  // 1. Find profile by userId
  const [profile] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, `${userId}`));

  if (!profile) {
    throw new AppError(status.NOT_FOUND, "User profile not found");
  }

  // 2. Remove falsy fields from input
  const cleanedProfile = removeFalsyFields(profileData);

  // 3. Update profile
  await db
    .update(userProfile)
    .set(cleanedProfile)
    .where(eq(userProfile.id, profile.id));

  // 4. Return updated profile (optional)
  const [updatedProfile] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.id, profile.id));

  return updatedProfile;
};

export const UserProfileService = { updateProfileData, updateProfileImage };
