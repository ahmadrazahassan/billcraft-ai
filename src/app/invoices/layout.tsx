import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardShell>{children}</DashboardShell>
}
