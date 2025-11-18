import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'

export function AppSidebar() {
  const { pathname } = useLocation()
  const { logout } = useAppStore()

  const items = [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'Pacientes', url: '/pacientes', icon: Users },
    { title: 'Agenda', url: '/agenda', icon: Calendar },
    { title: 'Financeiro', url: '/financeiro', icon: DollarSign },
    { title: 'Despesas', url: '/despesas', icon: Receipt },
    { title: 'Relatórios', url: '/relatorios', icon: BarChart3 },
    { title: 'Configurações', url: '/configuracoes', icon: Settings },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 font-bold text-sidebar-foreground">
          <div className="w-8 h-8 rounded bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground">
            EM
          </div>
          <span className="truncate group-data-[collapsible=icon]:hidden">
            Dr. Everson
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <div className="mt-auto p-4 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip="Sair">
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  )
}
