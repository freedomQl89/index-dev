import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "大自爆运动 | The Great Disclosure",
  description: "大自爆运动 - 拆解中共审查机器与极权系统的真相披露行动。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
