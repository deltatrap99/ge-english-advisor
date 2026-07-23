import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GE English Advisor | Sổ tay tư vấn tiếng Anh",
  description:
    "Công cụ hỗ trợ Đại sứ Galaxy Education tư vấn lộ trình Cambridge YLE, General English và IELTS.",
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
