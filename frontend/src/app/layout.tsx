import type { Metadata, Viewport } from "next";
import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { I18nProvider } from "@/components/i18n-provider";
import { ServiceWorkerRegistrar } from "@/components/sw-registrar";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SimpleKeth — Know When & Where to Sell Your Crops",
  description:
    "AI-powered crop decision intelligence for Indian farmers. Get instant SELL or HOLD recommendations, compare mandis, and maximize your profit.",
  keywords: [
    "farming",
    "mandi prices",
    "crop selling",
    "agriculture India",
    "farmer profit",
    "SimpleKeth",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SimpleKeth",
  },
};

export const viewport: Viewport = {
  themeColor: "#2F5D3A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable} h-full`}>
      <body
        className="min-h-full flex flex-col antialiased"
        style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif" }}
      >
        <Providers>
          <I18nProvider>
            {children}
            <ServiceWorkerRegistrar />
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
