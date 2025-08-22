
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { AppShell } from '@/components/layout/AppShell';

export default function AnalyticsPage() {
    return (
        <AppShell>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                <AnalyticsDashboard />
            </main>
        </AppShell>
    );
}
