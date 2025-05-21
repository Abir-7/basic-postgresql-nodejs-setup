import { userRole, userRoles } from "../middlewares/auth/auth.interface";
import { AdminProfile } from "../modules/users/adminProfile/adminProfile.entity";
import { User } from "../modules/users/user/user.entity";
import getHashedPassword from "../utils/helper/getHashedPassword";
import { myDataSource } from "./database";

async function seedAdmin() {
  const adminData = {
    email: "admin@example.com",
    password: await getHashedPassword("admin123"),
    role: userRoles.SUPER_ADMIN,
    isVerified: true,
    needToResetPass: false,
  };

  try {
    const userRepo = myDataSource.getRepository(User);

    // 1. Check if any admin exists already
    const existingAdmin = await userRepo.findOne({
      where: { role: adminData.role },
    });

    if (existingAdmin) {
      console.log("Admin user already exists, skipping seed.");
      await myDataSource.destroy();
      return;
    }

    const adminUser = userRepo.create(adminData);

    // 3. Create AdminProfile and link it
    const adminProfile = new AdminProfile();
    adminProfile.fullName = "Default Admin";
    adminProfile.email = adminUser.email;
    adminProfile.user = adminUser;

    adminUser.adminProfile = adminProfile;

    // 4. Save user with cascade for adminProfile
    await userRepo.save(adminUser);

    console.log("Admin user seeded successfully!");

    await myDataSource.destroy();
  } catch (err) {
    console.error("Error seeding admin user:", err);
  }
}
