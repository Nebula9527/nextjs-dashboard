import bcrypt from "bcryptjs";
import { customers, revenue, users } from "../lib/placeholder-data";
import prisma from "../lib/prisma";

async function seedUsers() {
  await prisma.user.createMany({
    data: users.map((user) => ({
      name: user.name,
      email: user.email,
      password: user.password,
    })),
  });

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const stmt = prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
        },
      });
      return stmt;
    })
  );

  return insertedUsers;
}

async function seedCustomers() {
  await prisma.customer.createMany({
    data: customers.map((customer) => ({
      name: customer.name,
      email: customer.email,
      imageUrl: customer.image_url,
    })),
  });

  const insertedCustomers = await Promise.all(
    customers.map((customer) => {
      const stmt = prisma.customer.create({
        data: {
          name: customer.name,
          email: customer.email,
          imageUrl: customer.image_url,
        },
      });
      return stmt;
    })
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await prisma.revenue.createMany({
    data: revenue.map((rev) => ({
      month: rev.month,
      revenue: rev.revenue,
    })),
  });

  const insertedRevenue = await Promise.all(
    revenue.map((rev) => {
      const stmt = prisma.revenue.create({
        data: {
          month: rev.month,
          revenue: rev.revenue,
        },
      });
      return stmt;
    })
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    const result = await Promise.all([
      seedUsers(),
      seedCustomers(),
      seedRevenue(),
    ]);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
