### **1. 安装依赖**

首先安装 Prisma 和相关工具：

```bash
npm install prisma @prisma/client
# 或
yarn add prisma @prisma/client
```

---

### **2. 初始化 Prisma**

初始化 Prisma 配置文件并指定 SQLite 作为数据库：

```bash
npx prisma init --datasource-provider sqlite
```

这会生成 `prisma/schema.prisma` 文件，并配置 SQLite 连接。

---

### **3. 配置 `schema.prisma`**

修改 `prisma/schema.prisma` 文件，定义数据模型。例如：

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db" // SQLite 数据库文件路径
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

---

### **4. 创建数据库并应用迁移**

运行以下命令，生成并执行迁移文件：

```bash
npx prisma migrate dev --name init
```

这会在 `prisma/migrations` 目录下生成迁移文件，并创建 `dev.db` SQLite 数据库文件。

---

### **5. 数据初始化（Seed 数据）**

在 `prisma/seed.ts` 中编写初始化数据的脚本（需先安装 TypeScript 依赖）：

```bash
npm install -D ts-node @types/node
# 或
yarn add -D ts-node @types/node
```

创建 `prisma/seed.ts`：

```typescript
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 清空现有数据（可选）
  await prisma.user.deleteMany();

  // 插入初始数据
  await prisma.user.createMany({
    data: [
      { email: "user1@example.com", name: "Alice" },
      { email: "user2@example.com", name: "Bob" },
    ],
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
```

在 `package.json` 中添加 Seed 脚本：

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

运行 Seed 命令：

```bash
npx prisma db seed
```

---

### **6. 在 Next.js 中集成 Prisma Client**

为避免多次实例化 Prisma Client，在 `lib/prisma.ts` 中创建全局实例：

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
```

---

### **7. 在 API 路由中使用 Prisma**

在 Next.js API 路由中查询数据：

```typescript
// pages/api/users.ts
import prisma from "../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
}
```

---

### **8. 启动项目**

运行 Next.js 开发服务器：

```bash
npm run dev
# 或
yarn dev
```

访问 `http://localhost:3000/api/users` 即可看到初始化的用户数据。

---

### **注意事项**

1. **SQLite 文件路径**  
   确保 `prisma/schema.prisma` 中 `url` 的路径正确，避免部署时找不到数据库文件。

2. **生产环境**  
   SQLite 不适合高并发生产场景。如需部署到 Vercel 等平台，考虑使用 PostgreSQL 或 MySQL。

3. **迁移管理**  
   每次修改数据模型后，运行 `npx prisma migrate dev --name <迁移名称>` 更新数据库结构。

4. **Prisma Studio**  
   使用以下命令启动 Prisma 图形化管理界面：
   ```bash
   npx prisma studio
   ```

---

### **完整流程总结**

1. 安装依赖 → 2. 初始化 Prisma → 3. 定义模型 → 4. 执行迁移 → 5. 写入初始数据 → 6. 集成到 Next.js → 7. 开发调试。
