import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "@/styled_components_registry";
import { ReactQueryClientProvider } from "@/ReactQueryClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Acropolis Tickets Availability Tool",
  description:
    "Check the live availability of tickets for the Acropolis site and set useful alerts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <StyledComponentsRegistry>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </StyledComponentsRegistry>
    </ReactQueryClientProvider>
  );
}