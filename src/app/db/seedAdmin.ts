import { userRoles } from "../middlewares/auth/auth.interface";

import { User } from "../modules/users/user/user.entity";
import { UserAuthentication } from "../modules/users/userAuthentication/user_authentication.entity";
import getHashedPassword from "../utils/helper/getHashedPassword";
import { myDataSource } from "./database";

export async function seedAdmin() {
  const adminData = {
    email: "admin@example.com",
    password: await getHashedPassword("admin123"),
    role: userRoles.SUPERADMIN,
    isVerified: true,
    needToResetPass: false,
  };

  try {
    await myDataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);

      // 1. Check if any admin exists already
      const existingAdmin = await userRepo.findOne({
        where: { role: adminData.role },
      });

      if (existingAdmin) {
        console.log("Admin user already exists, skipping seed.");
        return;
      }

      // 2. Create admin user
      const adminUser = userRepo.create({
        ...adminData,
        userProfile: {
          fullName: "ADMIN-1",
          phone: "01795377643",
        },
        authentication: {
          otp: null,
          expDate: null,
          token: null,
        },
      });

      // 4. Save with cascading profile
      await userRepo.save(adminUser);
      console.log("Admin user seeded successfully!");
    });
  } catch (err) {
    console.error("Error seeding admin user:", err);
  }
}
