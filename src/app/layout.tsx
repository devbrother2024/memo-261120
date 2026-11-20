import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// 가변 글꼴이라 Regular 400, Medium 500, Bold 700 을 모두 쓸 수 있다
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "메모",
  description: "메모를 쓰고 모아 보는 앱",
  applicationName: "메모",
  // iPhone: 홈 화면에 추가하면 주소창 없이 앱처럼 열린다. 홈 화면 이름은 '메모'
  appleWebApp: { capable: true, title: "메모", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  // 앱 위쪽 막대 색: surface/page 의 Light, Dark 값
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f4f6" },
    { media: "(prefers-color-scheme: dark)", color: "#101014" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
