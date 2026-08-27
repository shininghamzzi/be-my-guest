import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Footer from "@/app/_components/footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tv-be-my-guest.vercel.app/"),
  title: "비마이게스트 (비 마이 게스트) 회차별 불판 & 아카이브 | LEZHIN SNACK",
  description: "(총 53부작) 텍스트로 달리는 실시간 감상존",
  keywords: [
    "비마이게스트",
    "비 마이 게스트",
    "비마이게스트 불판",
    "이태빈",
    "레진스낵",
    "비마이게스트 회차별",
    "비마이게스트 아카이브",
    "Be My Guest",
    "이태빈 숏드라마",
  ],
  authors: [{ name: "shininghamzzi" }],
  openGraph: {
    title: "비마이게스트 회차별 불판 🎬",
    description: "(총 53부작) 텍스트로 달리는 실시간 감상존",
    images: [
      {
        url: "/poster-twitter-two.jpg",
        width: 1200,
        height: 630,
        alt: "비마이게스트 불판",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "비마이게스트 회차별 불판 🎬",
    description: "(총 53부작) 텍스트로 달리는 실시간 감상존",
    images: ["/poster-twitter-two.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <main className="bg-secondary selection:bg-primary selection:text-ink flex min-h-screen justify-center bg-[radial-gradient(circle_at_top,_#ffe7d6_0%,_#ffcde1_45%,_#f8f4ff_100%)] bg-[url('/bg_no-house_resize.jpg')] bg-cover bg-fixed bg-center text-neutral-950">
          <div className="flex w-full max-w-md flex-col gap-6 px-4 py-8">
            {children}

            <Footer />
          </div>
        </main>
        <Analytics />
      </body>
    </html>
  );
}
