
import { AppShell } from '@/components/layout/AppShell';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Suspense } from 'react';

function DashboardPage() {
  return (
    <Suspense>
      <AppShell>
        <Dashboard />
      </AppShell>
    </Suspense>
  );
}

export default function Home() {
  return (
    <DashboardPage />
  );
}
