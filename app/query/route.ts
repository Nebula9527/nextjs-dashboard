import prisma from "../lib/prisma";

async function listInvoices() {
  const data = await prisma.invoice.findMany({
    select: {
      amount: true,
      customer: {
        select: {
          name: true,
        },
      },
    },
    where: {
      amount: 666,
    },
  });

  console.log(data);

  return data;
}

export async function GET() {
  // return Response.json({
  //   message:
  //     "Uncomment this file and remove this line. You can delete this file when you are finished.",
  // });
  try {
    return Response.json(await listInvoices());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
