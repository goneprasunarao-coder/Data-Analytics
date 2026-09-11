import type { Metadata } from "next"
import { DashboardApp } from "@/components/dashboard/dashboard-app"

export const metadata: Metadata = {
  title: "Dashboard — Workforce Signal",
  description:
    "Interactive workforce attrition dashboard: live metrics, in-browser prediction, model performance, and data exploration.",
}

export default function DashboardPage() {
  return <DashboardApp />
}
