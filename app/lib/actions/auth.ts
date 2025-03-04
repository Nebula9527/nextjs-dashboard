"use server";

import { signIn } from "@/auth";
import { ResultEnum } from "@/enums/https";
import { z } from "zod";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.string().min(1, "邮箱是必填项").email("请输入有效的邮箱地址"),
  password: z
    .string()
    .min(6, "密码至少需要6个字符")
    .max(100, "密码不能超过100个字符"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

type State = {
  errors?: {
    email?: string[];
    password?: string[];
    rememberMe?: string[];
  };
  message?: string;
  code?: ResultEnum;
} | null;

// 服务器端action处理函数
export async function loginAction(prevState: State, formData: FormData) {
  const rawFormData: LoginFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    rememberMe: formData.get("remember-me") === "on",
  };

  // 验证表单数据
  const validatedFields = loginSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      code: ResultEnum.UNCERTIFIED,
      message: "表单验证失败",
    };
  }

  try {
    const result = await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false,
    });

    console.log(result);

    if (result?.error) {
      return {
        code: ResultEnum.UNKNOWN,
        message: "登录失败，请检查您的凭据",
      };
    }

    redirect("/");
  } catch (error) {
    return {
      code: ResultEnum.UNKNOWN,
      message: "登录失败，请检查您的凭据",
    };
  }
}
