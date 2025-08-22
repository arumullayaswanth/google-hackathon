
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { AppShell } from '@/components/layout/AppShell';
import { Suspense } from 'react';

export default function AnalyticsPage() {
    return (
        <Suspense>
            <AppShell>
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <AnalyticsDashboard />
                </main>
            </AppShell>
        </Suspense>
    );
}
