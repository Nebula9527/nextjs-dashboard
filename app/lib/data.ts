import prisma from "./prisma";
import { formatCurrency } from "./utils";

export async function fetchRevenue() {
  try {
    const data = await prisma.revenue.findMany();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await prisma.invoice.findMany({
      select: {
        amount: true,
        customer: {
          select: {
            name: true,
            imageUrl: true,
            email: true,
          },
        },
        id: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
    });

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  try {
    const invoiceCountPromise = prisma.invoice.count();
    const customerCountPromise = prisma.customer.count();
    const invoiceStatusPromise = prisma.invoice.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        OR: [{ status: "paid" }, { status: "pending" }],
      },
    });

    const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = invoiceCount;
    const numberOfCustomers = customerCount;
    const totalPaidInvoices = formatCurrency(invoiceStatus._sum.amount || 0);
    const totalPendingInvoices = formatCurrency(invoiceStatus._sum.amount || 0);

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await prisma.invoice.findMany({
      select: {
        id: true,
        amount: true,
        date: true,
        status: true,
        customer: {
          select: {
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
      where: {
        OR: [
          { customer: { name: { contains: query } } },
          { customer: { email: { contains: query } } },
          { amount: { equals: parseInt(query) || undefined } },
          { status: { contains: query } },
        ],
      },
      orderBy: {
        date: "desc",
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    return invoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await prisma.invoice.count({
      where: {
        OR: [
          { customer: { name: { contains: query } } },
          { customer: { email: { contains: query } } },
        ],
      },
    });
    const totalPages = Math.ceil(data / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  // let invoice: InvoiceForm[] = [];
  return [];
  // try {
  //   const data = await sql<InvoiceForm[]>`
  //     SELECT
  //       invoices.id,
  //       invoices.customer_id,
  //       invoices.amount,
  //       invoices.status
  //     FROM invoices
  //     WHERE invoices.id = ${id};
  //   `;

  //   const invoice = data.map((invoice) => ({
  //     ...invoice,
  //     // Convert amount from cents to dollars
  //     amount: invoice.amount / 100,
  //   }));

  //   return invoice[0];
  // } catch (error) {
  //   console.error("Database Error:", error);
  //   throw new Error("Failed to fetch invoice.");
  // }
}

export async function fetchCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        invoices: {
          where: {
            status: "pending",
          },
          select: {
            amount: true,
          },
        },
      },
      where: {
        OR: [{ name: { contains: query } }, { email: { contains: query } }],
      },
      orderBy: {
        name: "asc",
      },
    });

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(
        customer.invoices.reduce((acc, inv) => acc + inv.amount, 0)
      ),
      total_paid: formatCurrency(0), // 暂时设为 0，需要单独查询 paid 发票
    }));

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}
