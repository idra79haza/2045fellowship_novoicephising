import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "피싱제로 — 보이스피싱 체험 시뮬레이터",
  description:
    "실제 보이스피싱 시나리오를 안전하게 체험하고, 대응법을 학습하세요. " +
    "검찰 사칭, 택배 문자, 가족 사칭 등 5가지 실전 시뮬레이션과 퀴즈로 피싱 판별력을 키워보세요.",
  keywords: [
    "보이스피싱",
    "피싱 예방",
    "보이스피싱 체험",
    "피싱 시뮬레이터",
    "전화 사기",
    "스미싱",
    "피싱 퀴즈",
  ],
  openGraph: {
    title: "피싱제로 — 보이스피싱 체험 시뮬레이터",
    description:
      "실제 보이스피싱 시나리오를 안전하게 체험하고, 대응법을 학습하세요.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="bg-gray-50 font-sans antialiased">
        <Header />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
