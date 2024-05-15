import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar"; // 导入 Navbar 组件
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Juni's Blog",
  description: "Just another blog.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar /> {/* 添加 Navbar 组件 */}
        {children}
      </body>
    </html>
  );
}
