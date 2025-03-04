import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("123456", 10);

  // 清理现有数据
  await prisma.user.deleteMany();

  // 创建用户
  await prisma.user.create({
    data: {
      name: "User",
      email: "user@nextmail.com",
      password,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
