import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tv-be-my-guest.vercel.app/"),
  title: "비마이게스트 회차별 불판",
  description: "총 53부작 캡처 대신 텍스트로 달리는 실시간 감상존",
  openGraph: {
    title: "비마이게스트 회차별 불판 🎬",
    description: "총 53부작 캡처 대신 텍스트로 달리는 실시간 감상존",
    images: [
      {
        url: "/poster.jpeg",
        width: 1200,
        height: 630,
        alt: "비마이게스트 불판",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "비마이게스트 회차별 불판 🎬",
    description: "총 53부작 캡처 대신 텍스트로 달리는 실시간 감상존",
    images: ["/poster-twitter.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <main className="flex min-h-screen justify-center bg-neutral-950 text-neutral-100 selection:bg-rose-500 selection:text-white">
          <div className="flex w-full max-w-md flex-col gap-6 px-4 py-8">
            {children}

            <footer className="mt-auto flex flex-col items-center gap-1.5 border-t border-neutral-900 py-8 text-center text-xs text-neutral-500">
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
                  className="text-neutral-400 underline underline-offset-2 transition hover:text-rose-400"
                >
                  @shininghamzzi
                </a>
              </p>
            </footer>
          </div>
        </main>
      </body>
    </html>
  );
}
