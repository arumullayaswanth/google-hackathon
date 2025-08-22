
'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
} from '@/components/ui/sidebar';
import { Home, Flame, Bot, Code, Shield, BarChart, Trophy, GalleryThumbnails } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: Home, tag: null },
  { href: '/?tag=firebase', label: 'Firebase', icon: Flame, tag: 'firebase' },
  { href: '/?tag=flutter', label: 'Flutter', icon: Code, tag: 'flutter' },
  { href: '/?tag=ai', label: 'AI', icon: Bot, tag: 'ai' },
  { href: '/mentors', label: 'Mentors', icon: Shield, tag: null, page: '/mentors' },
  { href: '/analytics', label: 'Analytics', icon: BarChart, tag: null, page: '/analytics' },
  { href: '/prizes', label: 'Prizes', icon: Trophy, tag: null, page: '/prizes' },
  { href: '/galaxy', label: 'Galaxy', icon: GalleryThumbnails, tag: null, page: '/galaxy' },
];

export function AppNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag');

  const isActive = (item: typeof navItems[number]) => {
    if (item.page) {
      return pathname === item.page;
    }
    if (item.tag) {
      return pathname === '/' && currentTag === item.tag;
    }
    return pathname === '/' && !currentTag;
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              asChild
              isActive={isActive(item)}
              tooltip={{ children: item.label, side: 'right' }}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
