"use server";

import { ResultEnum } from "@/enums/https";
import { z } from "zod";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { compare } from "bcryptjs";
import { SignJWT } from "jose";
import prisma from "@/app/lib/prisma";

// 定义登录表单的验证模式
const loginSchema = z.object({
  email: z.string().min(1, "邮箱是必填项").email("请输入有效的邮箱地址"),
  password: z
    .string()
    .min(6, "密码至少需要6个字符")
    .max(100, "密码不能超过100个字符"),
  rememberMe: z.boolean().optional(),
});

// 登录表单数据类型
type LoginFormData = z.infer<typeof loginSchema>;

// 登录状态返回类型
type State = {
  errors?: {
    email?: string[];
    password?: string[];
    rememberMe?: string[];
  };
  message?: string;
  code?: ResultEnum;
} | null;

/**
 * 处理登录的服务器端Action
 * @param prevState - 上一个状态
 * @param formData - 表单数据
 */
export async function loginAction(prevState: State, formData: FormData) {
  // 从表单数据中提取登录信息
  const rawFormData: LoginFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    rememberMe: formData.get("remember-me") === "on",
  };

  // 验证表单数据
  const validatedFields = loginSchema.safeParse(rawFormData);

  // 如果验证失败，返回错误信息
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      code: ResultEnum.UNCERTIFIED,
      message: "表单验证失败",
    };
  }

  try {
    // 在数据库中查找用户
    const user = await prisma.user.findUnique({
      where: {
        email: validatedFields.data.email,
      },
    });

    // 如果用户不存在，返回错误
    if (!user) {
      return {
        code: ResultEnum.UNCERTIFIED,
        message: "用户不存在",
      };
    }

    // 验证密码是否正确
    // 使用bcryptjs比较输入的密码和数据库中存储的哈希密码
    const isValidPassword = await compare(
      validatedFields.data.password,
      user.password
    );

    // 如果密码不正确，返回错误
    if (!isValidPassword) {
      return {
        code: ResultEnum.UNCERTIFIED,
        message: "密码错误",
      };
    }

    // 创建JWT token
    // 使用环境变量中的密钥
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    // 生成包含用户ID和密码的token
    const token = await new SignJWT({
      userId: user.id,
      password: user.password, // 用于在中间件中验证密码是否已更改
    })
      .setProtectedHeader({ alg: "HS256" }) // 设置加密算法
      .setExpirationTime("24h") // 设置token过期时间
      .sign(secret);

    // 设置cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true, // 防止JavaScript访问cookie
      secure: process.env.NODE_ENV === "production", // 在生产环境中只通过HTTPS发送
      sameSite: "lax", // 防止CSRF攻击
      expires: validatedFields.data.rememberMe
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 如果选择"记住我"，cookie保持30天
        : new Date(Date.now() + 24 * 60 * 60 * 1000), // 否则cookie保持24小时
    });

    // 登录成功，返回成功状态
    return {
      code: ResultEnum.SUCCESS,
      message: "登录成功",
      redirect: true, // 添加重定向标志
    };
  } catch (error) {
    // 捕获并记录任何可能发生的错误
    console.error("Login error:", error);
    return {
      code: ResultEnum.UNKNOWN,
      message: "登录失败，请稍后重试",
    };
  }
}
