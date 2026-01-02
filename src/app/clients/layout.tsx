import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardShell>{children}</DashboardShell>
}
