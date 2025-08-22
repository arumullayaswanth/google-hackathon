import { PrizesInfo } from '@/components/prizes/PrizesInfo';
import { AppShell } from '@/components/layout/AppShell';

export default function PrizesPage() {
    return (
        <AppShell>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                <PrizesInfo />
            </main>
        </AppShell>
    );
}
