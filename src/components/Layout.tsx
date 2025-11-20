import { Outlet, Navigate } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { AppHeader } from '@/components/AppHeader'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export default function Layout() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-secondary/20">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
