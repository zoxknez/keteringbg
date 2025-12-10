import type { Metadata } from "next";
import { Toaster } from 'sonner';
import "./globals.css";

export const metadata: Metadata = {
  title: "Ketering Beograd | Ekskluzivni Ketering",
  description: "Najsavršeniji ketering za vaše proslave. Dragan Spalević PR Ketering Beograd.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
