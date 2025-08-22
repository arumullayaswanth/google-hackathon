import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function Logo() {
  const { state } = useSidebar();
  return (
    <div className="flex items-center justify-center gap-2 p-2 group-data-[collapsible=icon]:justify-center">
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 text-primary"
      >
        <path
          d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 7L12 12M12 22V12M22 7L12 12M12 2V12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 4.5L17 9.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={cn(
          'text-lg font-bold transition-opacity duration-200',
          state === 'collapsed' ? 'opacity-0' : 'opacity-100'
        )}
      >
        Community Q&amp;A
      </span>
    </div>
  );
}
