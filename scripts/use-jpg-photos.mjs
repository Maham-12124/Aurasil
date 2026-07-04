import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

config({ path: ".env.local" });
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const products = await prisma.product.findMany();
let updated = 0;

for (const product of products) {
  if (product.image.endsWith(".svg")) {
    const jpgPath = product.image.replace(/\.svg$/, ".jpg");
    await prisma.product.update({ where: { id: product.id }, data: { image: jpgPath } });
    updated++;
  }
}

console.log(`Switched ${updated} product(s) to real .jpg stock photos.`);
await prisma.$disconnect();
