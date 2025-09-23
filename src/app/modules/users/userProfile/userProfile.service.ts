import status from "http-status";

import AppError from "../../../errors/AppError";
import { removeFalsyFields } from "../../../utils/helper/removeFalsyField";
import unlinkFile from "../../../middlewares/fileUpload/unlinkFiles";
import { getRelativePath } from "../../../middlewares/fileUpload/getRelativeFilePath";

import { eq } from "drizzle-orm";
import { User } from "../../../db/schema/user.schema";
import { db } from "../../../db";
import {
  UserProfile,
  UserProfileInsert,
} from "../../../db/schema/userProfile.schema";
import { app_config } from "../../../config";

const updateProfileImage = async (path: string, email: string) => {
  if (!path) {
    throw new AppError(status.NOT_FOUND, "Image not found");
  }

  return await db
    .transaction(async (tx) => {
      // 1. Find user with profile by email
      const [user_with_profile] = await tx
        .select({
          userId: User.id,
          profileId: UserProfile.id,
          oldImage: UserProfile.image,
        })
        .from(User)
        .leftJoin(UserProfile, eq(User.id, UserProfile.user_id))
        .where(eq(User.email, email));

      if (!user_with_profile || !user_with_profile.profileId) {
        throw new AppError(status.NOT_FOUND, "User not found");
      }

      // 2. Prepare new image path
      const image = getRelativePath(path);
      const oldImage = user_with_profile.oldImage;

      // 3. Update profile image
      await tx
        .update(UserProfile)
        .set({ image })
        .where(eq(UserProfile.id, user_with_profile.profileId));

      // 4. Delete old image file if exists
      if (oldImage) {
        unlinkFile(oldImage);
      }

      // 5. Return updated profile info (optional: fetch updated row)
      const [updated_profile] = await tx
        .select()
        .from(UserProfile)
        .where(eq(UserProfile.id, user_with_profile.profileId));

      return updated_profile;
    })
    .catch((error: any) => {
      if (path) unlinkFile(getRelativePath(path));
      throw new Error(error);
    });
};

const updateProfileData = async (
  profile_data: Partial<UserProfileInsert>,
  userId: string,
  image_path: string
) => {
  // 1. Find profile by userId
  const [profile] = await db
    .select()
    .from(UserProfile)
    .where(eq(UserProfile.user_id, `${userId}`));

  if (!profile) {
    throw new AppError(status.NOT_FOUND, "User profile not found");
  }

  const old_image = profile.image;
  // 2. Remove falsy fields from input
  let cleaned_profile = removeFalsyFields(profile_data);

  if (image_path) {
    const image = `${app_config.server.base_url}${getRelativePath(image_path)}`;

    cleaned_profile = {
      ...cleaned_profile,
      image,
    };
  }

  // 3. Update profile
  await db
    .update(UserProfile)
    .set(cleaned_profile)
    .where(eq(UserProfile.id, profile.id));

  if (image_path) {
    unlinkFile(getRelativePath(old_image as string)); //! todo   unlink not work  need to fix
  }

  // 4. Return updated profile (optional)
  const [updatedProfile] = await db
    .select()
    .from(UserProfile)
    .where(eq(UserProfile.id, profile.id));

  return updatedProfile;
};

export const UserProfileService = { updateProfileData, updateProfileImage };
