import { AppShell } from '@/components/layout/AppShell';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Suspense } from 'react';

function DashboardPage() {
  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  );
}

export default function Home() {
  return (
    <Suspense>
      <DashboardPage />
    </Suspense>
  );
}
