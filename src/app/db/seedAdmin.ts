import { eq } from "drizzle-orm";
import { TUserRole, userRoles } from "../middlewares/auth/auth.interface";
import get_hashed_password from "../utils/helper/getHashedPassword";
import { db } from "./db";
import { UserAuthentication } from "./schema/user.authentication";
import { User } from "./schema/user.schema";
import { UserProfile } from "./schema/userProfile.schema";
import { appConfig } from "../config";
import logger from "../utils/logger";

export async function seedAdmin() {
  const adminEmail = appConfig.admin.email as string;
  const adminRole: TUserRole = "SUPERADMIN";

  // Check if admin user exists
  const existing_admin = await db
    .select()
    .from(User)
    .where(eq(User.role, adminRole))
    .limit(1);

  if (existing_admin.length > 0) {
    console.log("Admin user already exists, skipping seed.");
    return;
  }

  // Hash password
  const hashedPassword = await get_hashed_password(
    appConfig.admin.password as string
  );

  // Run all inserts in a transaction
  await db.transaction(async (tx) => {
    // 1. Insert user and get inserted id
    const [inserted_user] = await tx
      .insert(User)
      .values({
        email: adminEmail as string,
        password: hashedPassword,
        role: adminRole,
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
      createdAt: new Date(),
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
