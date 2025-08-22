import { QuestionDetails } from '@/components/questions/QuestionDetails';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';

export default function QuestionPage({ params }: { params: { id: string } }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon" className="hidden md:flex">
          <AppSidebar />
        </Sidebar>
        <SidebarInset className="flex-1">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <QuestionDetails questionId={params.id} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
