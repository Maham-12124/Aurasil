import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

config({ path: ".env.local" });
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const email = "aurasil@gmail.com";
const password = "Aurasil@123";
const passwordHash = await bcrypt.hash(password, 12);

const user = await prisma.user.upsert({
  where: { email },
  update: { passwordHash, role: "ADMIN" },
  create: { name: "Aurasil Admin", email, passwordHash, role: "ADMIN" },
  select: { id: true, email: true, role: true },
});

console.log("Admin ready:", user);
await prisma.$disconnect();
