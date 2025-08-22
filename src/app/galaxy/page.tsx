
import { ImageGallery } from '@/components/galaxy/ImageGallery';
import { AppShell } from '@/components/layout/AppShell';

export default function GalaxyPage() {
    return (
        <AppShell>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                <ImageGallery />
            </main>
        </AppShell>
    );
}
