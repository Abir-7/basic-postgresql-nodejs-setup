import { eq } from "drizzle-orm";
import { TUserRole, user_roles } from "../middlewares/auth/auth.interface";
import get_hashed_password from "../utils/helper/getHashedPassword";
import { db } from ".";

import { User } from "./schema/user.schema";

import { app_config } from "../config";
import logger from "../utils/serverTools/logger";
import { UserProfile } from "./schema/userProfile.schema";
import { UserAuthentication } from "./schema/user.authentication";

export async function seedAdmin() {
  const admin_email = app_config.admin.email as string;
  const admin_role: TUserRole = "SUPERADMIN";

  // Check if admin user exists
  const existing_admin = await db
    .select()
    .from(User)
    .where(eq(User.role, admin_role))
    .limit(1);

  if (existing_admin.length > 0) {
    console.log("Admin user already exists, skipping seed.");
    return;
  }

  // Hash password
  const hashed_password = await get_hashed_password(
    app_config.admin.password as string
  );

  // Run all inserts in a transaction
  await db.transaction(async (tx) => {
    // 1. Insert user and get inserted id
    const [inserted_user] = await tx
      .insert(User)
      .values({
        email: admin_email as string,
        password: hashed_password,
        role: admin_role,
        is_verified: true,
        need_to_reset_pass: false,
      })
      .returning({
        id: User.id,
      });

    // 2. Insert user profile
    await tx.insert(UserProfile).values({
      full_name: "ADMIN-1",
      phone: "01795377643",
      user_id: inserted_user.id,
      is_deleted: false,
    });

    // 3. Insert user authentication
    await tx.insert(UserAuthentication).values({
      user_id: inserted_user.id,
      otp: null,
      exp_date: null,
      token: null,
    });

    logger.info("Admin user seeded successfully!");
  });
}
