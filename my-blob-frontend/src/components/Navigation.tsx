"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "./AuthProvider";
import { useViewContext } from "./ViewContext";
import { UserMenu } from "./UserMenu";
import { User } from "@/services/userApi";

export const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthContext();
  const { currentView, setCurrentView } = useViewContext();
  const pathname = usePathname();
  const [localAuthState, setLocalAuthState] = React.useState({
    isAuthenticated: false,
    user: null as User | null,
  });
  const router = useRouter();

  // 监听认证状态变化
  React.useEffect(() => {
    const handleAuthChange = (event: any) => {
      console.log("Navigation received authStateChanged event", event.detail);
      setLocalAuthState(event.detail);
    };

    window.addEventListener("authStateChanged", handleAuthChange);
    return () =>
      window.removeEventListener("authStateChanged", handleAuthChange);
  }, []);

  // 使用本地状态或 Context 状态
  const currentAuthState = localAuthState.isAuthenticated
    ? localAuthState
    : { isAuthenticated, user };

  // 在登录页面隐藏导航栏
  if (pathname === "/auth") {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">我的博客</span>
            </Link>

            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <button
                onClick={() => setCurrentView("home")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "home"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-900 hover:text-gray-500"
                }`}
              >
                首页
              </button>
              <button
                onClick={() => setCurrentView("articles")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "articles"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-900 hover:text-gray-500"
                }`}
              >
                文章
              </button>
              <button
                onClick={() => setCurrentView("about")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "about"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-900 hover:text-gray-500"
                }`}
              >
                关于
              </button>
              <button
                onClick={() => setCurrentView("contact")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "contact"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-900 hover:text-gray-500"
                }`}
              >
                联系
              </button>
              {currentAuthState.isAuthenticated && (
                <button
                  onClick={() => setCurrentView("users")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === "users"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-900 hover:text-gray-500"
                  }`}
                >
                  用户管理
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {currentAuthState.isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <UserMenu
                  user={currentAuthState.user}
                  handleLogout={handleLogout}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  登录/注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
