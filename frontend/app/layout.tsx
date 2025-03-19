import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Styles
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

// Client components
import MantineProviderClient from '../components/providers/mantine-provider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "To-Do App",
  description: "A To-Do application with authentication and ChatGPT integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-mantine-color-scheme="light">
      <head>
        {/* ColorSchemeScript artık MantineProviderClient içinde */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <MantineProviderClient>
          {children}
        </MantineProviderClient>
      </body>
    </html>
  );
}
