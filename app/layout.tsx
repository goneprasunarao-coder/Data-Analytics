import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Workforce Signal — Attrition Analytics & Prediction",
  description:
    "A hybrid machine learning and business intelligence platform for employee attrition prediction, workforce analytics, and retention strategy. Live metrics, in-browser modeling, and interactive dashboards.",
  keywords: [
    "employee attrition",
    "HR analytics",
    "workforce analytics",
    "attrition prediction",
    "people analytics",
    "retention",
  ],
  authors: [{ name: "Workforce Signal" }],
  openGraph: {
    title: "Workforce Signal — Attrition Analytics & Prediction",
    description:
      "Predict attrition risk and explore workforce metrics with an interactive, in-browser analytics platform.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0e17",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="ambient-bg">{children}</body>
    </html>
  )
}
