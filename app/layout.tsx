import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import StyledComponentsRegistry from "@/styled_components_registry"
import { GlobalContextProvider } from "./ContextProvider"
import { ReactQueryClientProvider } from "@/ReactQueryClientProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HH Tickets Availability Tool",
  description:
    "Check the live availability of tickets for all greek archaeological sites and set useful alerts",
  keywords: [
    "acropolis tickets",
    "acropolis tickets availability",
    "acropolis tickets alert",
    "acropolis tickets availability alert",
    "acropolis tickets availability tool",
    "acropolis tickets alert tool",
    "acropolis tickets availability checker",
    "greece archaeological sites tickets",
    "greece archaeological sites tickets availability",
    "greece archaeological sites tickets alert",
    "greece archaeological sites tickets availability alert",
    "acropolis e-tickets availability",
    "acropolis online tickets availability alert",
    "acropolis online tickets availability tool",
    "acropolis online tickets availability checker",
    "acropolis online tickets alert",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ReactQueryClientProvider>
      <GlobalContextProvider>
        <StyledComponentsRegistry>
          <html lang="en">
            <body className={inter.className}>{children}</body>
          </html>
        </StyledComponentsRegistry>
      </GlobalContextProvider>
    </ReactQueryClientProvider>
  )
}
