'use client';

import { useHackathon } from '@/context/HackathonContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function HackathonModeToggle() {
  const { isHackathonMode, toggleHackathonMode } = useHackathon();

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="hackathon-mode" 
        checked={isHackathonMode}
        onCheckedChange={toggleHackathonMode}
      />
      <Label htmlFor="hackathon-mode" className="text-sm font-medium">Hackathon Mode</Label>
    </div>
  );
}
