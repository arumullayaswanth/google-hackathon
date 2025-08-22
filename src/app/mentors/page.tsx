
import { MentorList } from '@/components/mentors/MentorList';
import { AppShell } from '@/components/layout/AppShell';
import { Suspense } from 'react';

export default function MentorsPage() {
    return (
        <Suspense>
            <AppShell>
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <MentorList />
                </main>
            </AppShell>
        </Suspense>
    );
}
