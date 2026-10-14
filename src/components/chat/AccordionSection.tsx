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
  onAddItem?: (sectionId: string, content: string, notes?: string) => void;
  onRemoveItem?: (sectionId: string, itemId: string) => void;
}

export function AccordionSection({
  section,
  isOpen,
  onToggle,
  processContent,
  caseId,
  animationDelay = 0,
  onAddItem,
  onRemoveItem,
}: AccordionSectionProps) {
  const authCode = caseId && caseId.length >= 5 ? caseId.slice(-5) : caseId;
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState('');
  const [draftNote, setDraftNote] = useState('');

  const handleAdd = () => {
    if (!draft.trim() || !onAddItem) return;
    onAddItem(section.id, draft.trim(), draftNote.trim() || undefined);
    setDraft('');
    setDraftNote('');
    setShowForm(false);
  };

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
                onDelete={item.custom && onRemoveItem ? () => onRemoveItem(section.id, item.id) : undefined}
              />
            ))}

            {onAddItem && (
              showForm ? (
                <div className="border-2 border-dashed border-primary/40 rounded-xl p-3 bg-muted/40 flex flex-col gap-2">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type the new CR message... ([Client's Name], Agent_name, {case_id} and {auth_code} placeholders work here)"
                    rows={4}
                    className="w-full px-3 py-2 border-2 border-border rounded-lg bg-card text-foreground text-[0.8rem] focus:outline-none focus:border-primary resize-y"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={draftNote}
                    onChange={(e) => setDraftNote(e.target.value)}
                    placeholder="Label (optional)"
                    className="w-full px-3 py-1.5 border-2 border-border rounded-lg bg-card text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => { setShowForm(false); setDraft(''); setDraftNote(''); }}
                      className="px-3 py-1.5 text-xs rounded-lg border border-border text-foreground hover:bg-muted transition font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAdd}
                      disabled={!draft.trim()}
                      className="px-3 py-1.5 text-xs rounded-lg bg-primary text-primary-foreground font-medium transition hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Add CR
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full py-2 border-2 border-dashed border-border rounded-xl text-[0.8rem] font-medium text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-muted/40 transition-all"
                >
                  ＋ Add new CR
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
