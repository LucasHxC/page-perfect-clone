import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { copyText } from '@/lib/clipboard';

interface SidebarButton {
  label: string;
  symbol: string;
  message: string;
}

interface SidebarPanelProps {
  buttons: SidebarButton[];
  processContent: (content: string) => string;
  side: 'left' | 'right';
}

export function SidebarPanel({ buttons, processContent, side }: SidebarPanelProps) {
  const handleCopy = async (message: string, label: string) => {
    const ok = await copyText(processContent(message));
    if (ok) toast.success(`Copied: ${label}`);
    else toast.error('Failed to copy');
  };

  return (
    <div
      className={cn(
        "fixed top-28 z-40 hidden lg:flex flex-col gap-1.5 max-w-[152px]",
        side === 'left' ? "left-3" : "right-3"
      )}
    >
      {buttons.map((btn, i) => (
        <button
          key={i}
          onClick={() => handleCopy(btn.message, btn.label)}
          title={btn.message}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1.5 bg-card border-2 border-border rounded-[10px]",
            "shadow-md cursor-pointer transition-all duration-200 text-[0.82rem] text-foreground font-medium",
            "hover:bg-muted hover:border-primary/30 hover:shadow-[0_6px_16px_rgba(139,92,246,0.15)]",
            side === 'left' ? "hover:-translate-x-0.5" : "hover:translate-x-0.5"
          )}
        >
          {btn.symbol && <span className="text-muted-foreground">{btn.symbol}</span>}
          <span className="truncate">{btn.label}</span>
        </button>
      ))}
    </div>
  );
}
