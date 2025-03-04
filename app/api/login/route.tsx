import prisma from "@/app/lib/prisma";
import { ResultEnum } from "@/enums/https";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Record<"email" | "password", string>> }
) {
  const { email, password } = await params;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user)
    return NextResponse.json(
      { error: "用户不存在" },
      { status: ResultEnum.UNKNOWN }
    );

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid)
    return NextResponse.json(
      { error: "密码错误" },
      { status: ResultEnum.UNKNOWN }
    );
}
