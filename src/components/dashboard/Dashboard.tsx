'use client';

import { QuestionForm } from '@/components/questions/QuestionForm';
import { QuestionList } from '@/components/questions/QuestionList';

export function Dashboard() {
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:grid-cols-4">
        <div className="lg:col-span-2 xl:col-span-3">
          <QuestionList />
        </div>
        <div className="hidden lg:block">
          <QuestionForm />
        </div>
      </div>
    </main>
  );
}
