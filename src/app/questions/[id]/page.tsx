import { QuestionDetails } from '@/components/questions/QuestionDetails';
import { AppShell } from '@/components/layout/AppShell';
import { Suspense } from 'react';

export default function QuestionPage({ params }: { params: { id: string } }) {
  return (
    <Suspense>
      <AppShell>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <QuestionDetails questionId={params.id} />
        </main>
      </AppShell>
    </Suspense>
  );
}
