'use client';

import { Logo } from '@/components/icons/Logo';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { AppNavigation } from './AppNavigation';
import { HackathonCountdown } from '../hackathon/HackathonCountdown';

export function AppSidebar() {
  return (
    <div className="flex h-full flex-col">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="flex-1 p-0">
        <AppNavigation />
        <Separator className="my-2" />
        <HackathonCountdown />
        <Separator className="my-2" />
        <Leaderboard />
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <Separator className="my-2" />
        <p className="p-4 text-xs text-muted-foreground">© 2024 Community Q&amp;A</p>
      </SidebarFooter>
    </div>
  );
}
