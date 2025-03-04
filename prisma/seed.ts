// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 清空现有数据（可选）
  await prisma.user.deleteMany();

  // 插入初始数据
  await prisma.user.createMany({
    data: [
      {
        email: "735039922@qq.com",
        name: "陆烟儿",
        phone: "13628108279",
        password: await hash("L3244886", 12),
      },
      {
        email: "154093428@qq.com",
        name: "Alice",
        phone: "13800000000",
        password: await hash("L3244886", 12),
      },
      {
        email: "user2@example.com",
        name: "Bob",
        phone: "13800000001",
        password: await hash("L3244886", 12),
      },
    ],
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error("Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
