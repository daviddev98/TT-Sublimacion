"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ClipboardList, LogOut, RotateCcw, Scissors } from "lucide-react"
import { toast } from "sonner"
import { SESSION_COOKIE } from "@/lib/auth"
import { useOrders } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const NAV = [
  { href: "/pedido", label: "Pedido", icon: ClipboardList },
  { href: "/cutplan", label: "Cutplan", icon: Scissors },
]

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { resetDemo } = useOrders()

  function logout() {
    document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
    router.push("/login")
    router.refresh()
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-brand/25">
      <SidebarHeader className="border-b border-brand/20 px-3 py-4">
        <Link href="/pedido" className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand text-[11px] font-semibold tracking-[0.14em] text-white">
            TT
          </span>
          <span className="grid group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">
              TT Sublimación
            </span>
            <span className="text-xs text-muted-foreground">
              Pedidos y cutplan
            </span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(pathname, item.href)}
                    tooltip={item.label}
                    className="data-[active=true]:border-l-2 data-[active=true]:border-brand data-[active=true]:bg-brand/5 data-[active=true]:text-brand"
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-2 border-t border-brand/20">
        <Button
          variant="ghost"
          size="sm"
          className="justify-start group-data-[collapsible=icon]:hidden"
          onClick={() => {
            resetDemo()
            toast.success("Datos de prueba restaurados")
          }}
        >
          <RotateCcw />
          Restablecer datos
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start"
          onClick={logout}
        >
          <LogOut />
          <span className="group-data-[collapsible=icon]:hidden">
            Cerrar sesión
          </span>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
