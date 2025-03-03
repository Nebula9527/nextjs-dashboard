import bcrypt from "bcryptjs";
import { invoices, customers, revenue, users } from "../lib/placeholder-data";
import prisma from "../lib/prisma";

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" }); // 注释掉

async function seedUsers() {
  await prisma.user.createMany({
    data: users.map((user) => ({
      id: user.id,
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
          id: user.id,
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

async function seedInvoices() {
  await prisma.invoice.createMany({
    data: invoices.map((invoice) => ({
      customerId: invoice.customer_id,
      amount: invoice.amount,
      status: invoice.status,
      date: invoice.date,
    })),
  });

  const insertedInvoices = await Promise.all(
    invoices.map((invoice) => {
      const stmt = prisma.invoice.create({
        data: {
          customerId: invoice.customer_id,
          amount: invoice.amount,
          status: invoice.status,
          date: invoice.date,
        },
      });
      return stmt;
    })
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await prisma.customer.createMany({
    data: customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      imageUrl: customer.image_url,
    })),
  });

  const insertedCustomers = await Promise.all(
    customers.map((customer) => {
      const stmt = prisma.customer.create({
        data: {
          id: customer.id,
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
      seedInvoices(),
      seedRevenue(),
    ]);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
