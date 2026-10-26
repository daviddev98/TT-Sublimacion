"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { OrdersProvider } from "@/lib/store"

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OrdersProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-w-0 bg-white">
          <header className="no-print flex h-14 shrink-0 items-center gap-3 border-b border-brand/20 px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4 bg-brand/30" />
            <p className="text-sm text-muted-foreground">
              TT Sublimación · Órdenes de trabajo
            </p>
          </header>
          <div className="min-w-0 flex-1 px-4 py-6 md:px-8">{children}</div>
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </OrdersProvider>
  )
}
