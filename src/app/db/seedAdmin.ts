import { userRoles } from "../middlewares/auth/auth.interface";
import { AdminProfile } from "../modules/users/adminProfile/adminProfile.entity";
import { User } from "../modules/users/user/user.entity";
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
      const adminUser = userRepo.create(adminData);

      // 3. Create admin profile
      const adminProfile = new AdminProfile();
      adminProfile.fullName = "Default Admin";

      adminUser.adminProfile = adminProfile;

      // 4. Save with cascading profile
      await userRepo.save(adminUser);
      console.log("Admin user seeded successfully!");
    });
  } catch (err) {
    console.error("Error seeding admin user:", err);
  }
}
