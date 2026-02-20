import { useState } from 'react';
import { TemplateSection } from '@/data/chatTemplates';
import { TemplateCard } from './TemplateCard';
import { cn } from '@/lib/utils';

interface AccordionSectionProps {
  section: TemplateSection;
  isOpen: boolean;
  onToggle: () => void;
  processContent: (content: string) => string;
  caseId: string;
  animationDelay?: number;
}

export function AccordionSection({
  section,
  isOpen,
  onToggle,
  processContent,
  caseId,
  animationDelay = 0,
}: AccordionSectionProps) {
  const authCode = caseId && caseId.length >= 5 ? caseId.slice(-5) : caseId;

  return (
    <div
      id={`section-${section.id}`}
      style={{ animationDelay: `${animationDelay}ms` }}
      className={cn(
        "border-2 border-border rounded-2xl bg-card overflow-hidden transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-bottom-2",
        "shadow-md hover:shadow-lg hover:-translate-y-0.5",
        isOpen && "shadow-[0_8px_24px_rgba(139,92,246,0.2)] border-primary/40"
      )}
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 bg-transparent border-none cursor-pointer transition-colors hover:bg-muted text-left"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 flex-1">
          <span className="text-xl">{section.icon}</span>
          <span className="font-semibold text-foreground text-[0.9rem]">{section.title}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[0.7rem] font-medium">
            {section.items.length}
          </span>
        </div>
        <span
          className="text-muted-foreground transition-transform duration-200 text-sm"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-350"
        style={{ maxHeight: isOpen ? '5000px' : '0' }}
      >
        <div className="px-5 pb-5">
          {section.id === 'video-upload' && caseId && (
            <div className="mb-3 px-3 py-2 bg-muted rounded-lg">
              <p className="text-[0.875rem] text-muted-foreground">
                Auth code (last 5 digits of Case ID):{' '}
                <span className="font-mono font-semibold text-primary text-base">{authCode}</span>
              </p>
            </div>
          )}
          <div className="grid gap-2.5 pt-2">
            {section.items.map((item) => (
              <TemplateCard
                key={item.id}
                item={item}
                processContent={processContent}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
