import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tv-be-my-guest.vercel.app/"),
  title: "비마이게스트 회차별 불판",
  description: "(총 53부작) 텍스트로 달리는 실시간 감상존",
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

            <footer className="border-primary/20 mt-auto flex flex-col items-center gap-1.5 border-t py-8 text-center text-xs text-neutral-700">
              <p className="text-[11px] text-neutral-600">
                비방·악플 및 치명적인 스포일러는 무통보 삭제될 수 있습니다.
              </p>
              <p className="text-[10px] leading-tight text-neutral-600">
                본 사이트는 비공식 팬 사이트이며, 작품의 모든 저작권은 LEZHIN 및
                제작사에 있습니다.
              </p>
              <p className="pt-1 font-mono text-[10px] text-neutral-600">
                Made with 💙 for 이태빈 by{" "}
                <a
                  href="https://x.com/shininghamzzi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 transition hover:text-rose-600"
                >
                  @shininghamzzi
                </a>
              </p>
            </footer>
          </div>
        </main>
        <Analytics />
      </body>
    </html>
  );
}
