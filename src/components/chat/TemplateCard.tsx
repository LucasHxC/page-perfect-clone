import { useRef } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { TemplateSection } from '@/data/chatTemplates';
import { copyText } from '@/lib/clipboard';

interface TemplateCardProps {
  item: TemplateSection['items'][0];
  processContent: (content: string) => string;
}

export function TemplateCard({ item, processContent }: TemplateCardProps) {
  const copyBtnRef = useRef<HTMLButtonElement>(null);

  const handleCopy = async () => {
    const text = processContent(item.content);
    const ok = await copyText(text);
    if (!ok) {
      toast.error('Failed to copy');
      return;
    }
    toast.success('Copied to clipboard!');
    if (copyBtnRef.current) {
      copyBtnRef.current.textContent = '✓';
      copyBtnRef.current.classList.add('copied');
      setTimeout(() => {
        if (copyBtnRef.current) {
          copyBtnRef.current.textContent = '📋';
          copyBtnRef.current.classList.remove('copied');
        }
      }, 2000);
    }
  };

  return (
    <div
      className="template-card group relative p-3 border-2 border-border rounded-xl bg-card cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-px w-full"
      onClick={handleCopy}
    >
      {item.notes && (
        <span className="inline-block mb-2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-medium">
          {item.notes}
        </span>
      )}
      <p className="text-[0.8rem] leading-relaxed text-card-foreground whitespace-pre-wrap break-words pr-8">
        {processContent(item.content)}
      </p>
      <button
        ref={copyBtnRef}
        className={cn(
          "copy-btn absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-secondary border-2 border-border cursor-pointer",
          "opacity-0 group-hover:opacity-100 transition-all duration-200 text-foreground text-xs",
          "hover:bg-primary hover:text-primary-foreground hover:border-primary"
        )}
        onClick={(e) => { e.stopPropagation(); handleCopy(); }}
        title="Copy to clipboard"
      >
        📋
      </button>
    </div>
  );
}
