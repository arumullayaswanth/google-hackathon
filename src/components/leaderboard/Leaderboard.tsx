'use client';

import { getLeaderboard } from '@/lib/store';
import type { User } from '@/types';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Trophy } from 'lucide-react';
import { useSidebar } from '../ui/sidebar';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { state } = useSidebar();

  useEffect(() => {
    getLeaderboard().then(data => {
      setUsers(data as User[]);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2
        className={cn(
          'mb-4 text-lg font-semibold transition-opacity',
          state === 'collapsed' ? 'opacity-0' : 'opacity-100'
        )}
      >
        Top Contributors
      </h2>
      <ul className="space-y-2">
        {users.map((user, index) => (
          <li key={user.uid}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-sidebar-accent',
                    state === 'collapsed' && 'justify-center'
                  )}
                >
                  <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-primary">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} data-ai-hint="person avatar" />
                    <AvatarFallback>
                      {user.displayName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      'flex-1 transition-opacity',
                      state === 'collapsed' ? 'opacity-0 w-0' : 'opacity-100'
                    )}
                  >
                    <p className="font-medium truncate">{user.displayName}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.score} points
                    </p>
                  </div>
                  {index === 0 && (
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  )}
                  {index > 0 && index < 3 && (
                     <Award className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                hidden={state === 'expanded'}
                className="bg-sidebar text-sidebar-foreground border-sidebar-border"
              >
                <p className="font-bold">{user.displayName}</p>
                <p>{user.score} points</p>
              </TooltipContent>
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  );
}
