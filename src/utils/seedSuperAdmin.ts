import bcrypt from "bcrypt";
import { prisma } from "../config/db";

export const seedSuperAdmin = async () => {
  try {
    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || "naeem@portfolio.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const adminName = process.env.ADMIN_NAME || "Portfolio Admin Naeem";

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    let adminUser;

    if (existingAdmin) {
      console.log("✅ Admin user already exists!!");
      adminUser = existingAdmin;
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      // Create admin user
      adminUser = await prisma.user.create({
        data: {
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: "ADMIN",
        },
      });
      console.log("✅ Admin user created successfully!!");
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
