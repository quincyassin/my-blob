'use client';

import React, { useState } from 'react';
import { LoginForm } from '../../components/LoginForm';
import { RegisterForm } from '../../components/RegisterForm';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // 如果已经登录，重定向到首页
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLoginSuccess = () => {
    router.push('/');
  };

  const handleRegisterSuccess = () => {
    // 注册成功后切换到登录页面
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
} 