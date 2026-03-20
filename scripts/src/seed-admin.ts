import "dotenv/config";
import bcrypt from "bcryptjs";
import { db, adminsTable } from "@workspace/db";

async function seedAdmin() {
  const email = "admin@matka.com";
  const password = "admin123";
  const name = "Admin";

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.insert(adminsTable).values({
      email,
      password: hashedPassword,
      name,
    });
    console.log("Admin user created successfully");
  } catch (error) {
    console.log("Admin user already exists or error:", error);
  }
}

seedAdmin();