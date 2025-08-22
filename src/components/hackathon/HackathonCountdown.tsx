'use client';

import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { useSidebar } from '../ui/sidebar';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from '@/components/ui/tooltip';

// Set the end date for the hackathon
const HACKATHON_END_DATE = new Date('2024-12-31T23:59:59');

export function HackathonCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);
  const { state } = useSidebar();

  useEffect(() => {
    // This ensures the component only renders on the client, avoiding hydration mismatches.
    setIsClient(true);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = HACKATHON_END_DATE.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isClient) {
    // Render nothing on the server to prevent hydration mismatch
    return null;
  }

  const isExpanded = state === 'expanded';
  const displayTime = `${String(timeLeft.days).padStart(2, '0')}:${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;
  const expandedText = `Time Remaining: ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;


  return (
    <div className="p-4">
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                className={cn(
                    'flex items-center gap-3 p-2 rounded-md transition-colors',
                    state === 'collapsed' && 'justify-center'
                )}
                >
                    <Timer className="h-6 w-6 text-primary" />
                    <div
                        className={cn(
                        'flex-1 transition-opacity text-center',
                        !isExpanded ? 'opacity-0 w-0' : 'opacity-100'
                        )}
                    >
                        <p className="font-semibold text-sm">Time Left</p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                        </p>
                    </div>
                </div>
            </TooltipTrigger>
            <TooltipContent
                side="right"
                hidden={isExpanded}
                className="bg-sidebar text-sidebar-foreground border-sidebar-border"
            >
                <p className="font-bold">Hackathon Ends In:</p>
                <p>{timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes} minutes</p>
            </TooltipContent>
        </Tooltip>
    </div>
  );
}
