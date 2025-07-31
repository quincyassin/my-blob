import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../components/AuthProvider";
import { ViewProvider } from "../components/ViewContext";
import { Navigation } from "../components/Navigation";
import { AlertProvider } from "../components/AlertProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "我的博客",
  description: "记录前端开发与技术成长",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ViewProvider>
            <AlertProvider>
              <Navigation />
              <main className="min-h-screen bg-gray-50">{children}</main>
            </AlertProvider>
          </ViewProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
