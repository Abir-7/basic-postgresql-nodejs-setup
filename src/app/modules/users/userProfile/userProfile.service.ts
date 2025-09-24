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

const updateProfileData = async (
  profile_data: Partial<UserProfileInsert>,
  userId: string,
  image_path?: string
) => {
  // 1. Find profile by userId
  const [profile] = await db
    .select()
    .from(UserProfile)
    .where(eq(UserProfile.user_id, userId));

  if (!profile) {
    throw new AppError(status.NOT_FOUND, "User profile not found");
  }

  const old_image_id = profile.image_id;

  // 2. Clean input
  let cleaned_profile = removeFalsyFields(profile_data);

  // 3. Handle image
  if (image_path) {
    const new_image_id = getRelativePath(image_path);
    cleaned_profile.image_id = new_image_id;
    cleaned_profile.image = `${app_config.server.base_url}${new_image_id}`;
  }

  // 4. Update and fetch in one go
  const [updatedProfile] = await db
    .update(UserProfile)
    .set(cleaned_profile)
    .where(eq(UserProfile.id, profile.id))
    .returning(); // ✅ no need for a second select

  // 5. Remove old image (after successful update)
  if (image_path && old_image_id) {
    unlinkFile(getRelativePath(old_image_id));
  }

  return updatedProfile;
};

export const UserProfileService = { updateProfileData };
