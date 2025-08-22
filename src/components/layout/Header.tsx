'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Auth } from '@/components/auth/Auth';
import { Button } from '../ui/button';
import { PenSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { HackathonModeToggle } from '../hackathon/HackathonModeToggle';

export function Header() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="hidden text-xl font-bold tracking-tight sm:block">
          Community Q&A
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <HackathonModeToggle />
        {user && (
          <Button className="hidden sm:inline-flex">
            <PenSquare className="mr-2 h-4 w-4" />
            Ask Question
          </Button>
        )}
        <Auth />
      </div>
    </header>
  );
}
