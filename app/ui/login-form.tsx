"use client";
import React, { useActionState, useState, useEffect } from "react";
import {
  Sun,
  Moon,
  ChevronRight,
  User,
  Lock,
  Mail,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginAction } from "@/app/lib/actions/auth";

function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (state?.redirect) {
      // 在客户端处理重定向
      window.location.href = "/";
    }
  }, [state]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-purple-50"
      }`}
    >
      {/* <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleDarkMode}
          className={`rounded-full ${
            darkMode
              ? "bg-gray-800 text-yellow-300 border-gray-700"
              : "bg-white text-gray-800"
          }`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div> */}

      <div className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-xl flex">
        {/* Left side - Image */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80"
            alt="Friends enjoying life"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-600/80 to-blue-400/40 flex flex-col justify-end p-8">
            <h2 className="text-white text-3xl font-bold mb-2">加入我们!</h2>
            <p className="text-white/90 mb-6">与朋友联系，探索新的可能性。</p>
          </div>
        </div>

        <div
          className={`w-full md:w-1/2 p-8 md:p-12 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              欢迎回来!
            </h1>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              登录以继续您的旅程
            </p>
          </div>

          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className={darkMode ? "text-gray-300" : "text-gray-700"}
              >
                邮箱
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User
                    size={18}
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>
                <Input
                  id="email"
                  name="email"
                  className={`pl-10 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : ""
                  }`}
                  placeholder="your@email.com"
                />
                {state?.errors?.email && (
                  <span className="absolute -bottom-5 left-0 text-xs text-red-500">
                    {state.errors.email[0]}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className={darkMode ? "text-gray-300" : "text-gray-700"}
              >
                密码
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    size={18}
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>
                <Input
                  id="password"
                  name="password"
                  className={`pl-10 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : ""
                  }`}
                  placeholder="your password"
                />
                {state?.errors?.password && (
                  <span className="absolute -bottom-5 left-0 text-xs text-red-500">
                    {state.errors.password[0]}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  name="remember-me"
                  className={darkMode ? "border-gray-500" : ""}
                />
                <Label
                  htmlFor="remember-me"
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  记住我
                </Label>
              </div>
              <Button
                variant="link"
                className="text-sm font-medium text-purple-600 hover:text-purple-500 p-0"
              >
                忘记密码?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full py-6 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md transition-all duration-300"
              disabled={isPending}
            >
              登录
              <ChevronRight size={18} className="ml-1" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              还没有账号?{" "}
              <Button
                variant="link"
                className="font-medium text-purple-600 hover:text-purple-500 p-0"
              >
                立即注册
              </Button>
            </p>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div
                className={`absolute inset-0 flex items-center ${
                  darkMode ? "text-gray-600" : "text-gray-300"
                }`}
              >
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className={`px-2 ${
                    darkMode
                      ? "bg-gray-800 text-gray-400"
                      : "bg-white text-gray-500"
                  }`}
                >
                  或使用以下方式登录
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className={`py-2 px-4 ${
                  darkMode
                    ? "border-gray-600 hover:bg-gray-700 text-blue-400"
                    : "border-gray-300 hover:bg-gray-50 text-blue-600"
                }`}
              >
                <span className="text-blue-500 font-bold">QQ</span>
              </Button>
              <Button
                variant="outline"
                className={`py-2 px-4 ${
                  darkMode
                    ? "border-gray-600 hover:bg-gray-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Mail size={18} className="text-red-500" />
              </Button>
              <Button
                variant="outline"
                className={`py-2 px-4 ${
                  darkMode
                    ? "border-gray-600 hover:bg-gray-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <QrCode size={18} className="text-green-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
