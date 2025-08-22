'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Header } from '@/components/layout/Header';
import { AppSidebar } from '@/components/layout/AppSidebar';

export function AppShell({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon" className="hidden md:flex">
          <AppSidebar />
        </Sidebar>
        <SidebarInset className="flex-1">
            <Header />
            {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
