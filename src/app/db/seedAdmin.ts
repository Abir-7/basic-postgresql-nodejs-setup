import { eq } from "drizzle-orm";
import { TUserRole, userRoles } from "../middlewares/auth/auth.interface";
import getHashedPassword from "../utils/helper/getHashedPassword";
import { db } from "./db";
import { userAuthentication } from "./schema/user.authentication";
import { users } from "./schema/user.schema";
import { userProfile } from "./schema/userProfile.schema";

export async function seedAdmin() {
  const adminEmail = "admin@example.com";
  const adminRole: TUserRole = "SUPERADMIN";

  // Check if admin user exists
  const existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.role, adminRole))
    .limit(1);

  if (existingAdmin.length > 0) {
    console.log("Admin user already exists, skipping seed.");
    return;
  }

  // Hash password
  const hashedPassword = await getHashedPassword("admin123");

  // Run all inserts in a transaction
  await db.transaction(async (tx) => {
    // 1. Insert user and get inserted id
    const [insertedUser] = await tx
      .insert(users)
      .values({
        email: adminEmail,
        password: hashedPassword,
        role: adminRole,
        isVerified: true,
        needToResetPass: false,
      })
      .returning({
        id: users.id,
      });

    // 2. Insert user profile
    await tx.insert(userProfile).values({
      fullName: "ADMIN-1",
      phone: "01795377643",
      userId: insertedUser.id,
      isDeleted: false,
      createdAt: new Date(),
    });

    // 3. Insert user authentication
    await tx.insert(userAuthentication).values({
      userId: insertedUser.id,
      otp: null,
      expDate: null,
      token: null,
    });

    console.log("Admin user seeded successfully!");
  });
}
