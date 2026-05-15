import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import AuthProvider from "@/components/AuthProvider";
import VisitorTracker from "@/components/shared/VisitorTracker";
import PopupModal from "@/components/shared/PopupModal";
import WhatsAppWidget from "@/components/shared/WhatsAppWidget";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });

// 🔥 SEO ebong Social Media Sharing er jonno Open Graph add kora holo
export const metadata: Metadata = {
  title: "Twille - Wear the Standard",
  description: "Premium clothing brand for modern lifestyle. Discover curated collections designed for the modern lifestyle in Bangladesh.",
  keywords: ["Twille", "Clothing Brand", "Premium Fashion", "Mens Wear", "Womens Wear", "Bangladesh Fashion"],
  authors: [{ name: "Twille" }],
  openGraph: {
    title: "Twille - Wear the Standard",
    description: "Premium clothing brand for modern lifestyle.",
    url: "https://twille.vercel.app", // Deploy er por apnar ashol domain ekhane diben
    siteName: "Twille",
    images: [
      {
        url: "/icon.png", // Apni chaile ekhane ekta boro banner image er link dite paren (/banner.png)
        width: 800,
        height: 600,
        alt: "Twille Brand Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twille - Wear the Standard",
    description: "Premium clothing brand for modern lifestyle.",
    images: ["/icon.png"],
  },
  icons: {
    icon: [
      {
        url: "/icon.png",
        href: "/icon.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${syne.variable} font-sans bg-white text-gray-900 min-h-screen flex flex-col antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <LayoutWrapper>
            <VisitorTracker />
            <PopupModal />
            {children}
          </LayoutWrapper>
        </AuthProvider>
        
        <WhatsAppWidget />
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}