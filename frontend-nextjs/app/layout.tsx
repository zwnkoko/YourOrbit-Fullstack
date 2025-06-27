import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/shared/nav-bar";
import { Footer } from "@/components/shared/footer";
import { navLinks } from "@/app/navLinks";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YourOrbit",
  description: "Modular personal productivity suite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="mx-2 grid min-h-dvh grid-rows-[auto_1fr_auto] md:mx-auto md:max-w-7xl">
            <header className="pt-2">
              <NavBar title="🪐 yourOrbit" links={navLinks} />
            </header>
            <main>{children}</main>
            <footer className="flex flex-col items-center gap-4 pb-2">
              <Footer />
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
