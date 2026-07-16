import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { copyText } from '@/lib/clipboard';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableWrapper } from './SortableWrapper';

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
  const storageKey = `sidebar-order-${side}`;

  const [orderedButtons, setOrderedButtons] = useState<SidebarButton[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const labels: string[] = JSON.parse(saved);
        const byLabel = new Map(buttons.map(b => [b.label, b]));
        const ordered = labels.map(l => byLabel.get(l)).filter(Boolean) as SidebarButton[];
        const missing = buttons.filter(b => !labels.includes(b.label));
        return [...ordered, ...missing];
      }
    } catch {}
    return buttons;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(orderedButtons.map(b => b.label)));
  }, [orderedButtons, storageKey]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleCopy = async (message: string, label: string) => {
    const ok = await copyText(processContent(message));
    if (ok) toast.success(`Copied: ${label}`);
    else toast.error('Failed to copy');
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setOrderedButtons(items => {
      const oldIndex = items.findIndex(i => i.label === active.id);
      const newIndex = items.findIndex(i => i.label === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <div
      className={cn(
        "fixed top-28 z-40 hidden lg:flex flex-col gap-1.5 max-w-[152px]",
        side === 'left' ? "left-3" : "right-3"
      )}
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={orderedButtons.map(b => b.label)} strategy={verticalListSortingStrategy}>
          {orderedButtons.map((btn) => (
            <SortableWrapper key={btn.label} id={btn.label}>
              <button
                onClick={() => handleCopy(btn.message, btn.label)}
                title={btn.message}
                className={cn(
                  "w-full flex items-center gap-1.5 px-2 py-1.5 bg-card border-2 border-border rounded-[10px]",
                  "shadow-md transition-all duration-200 text-[0.82rem] text-foreground font-medium",
                  "hover:bg-muted hover:border-primary/30 hover:shadow-[0_6px_16px_rgba(139,92,246,0.15)]",
                  side === 'left' ? "hover:-translate-x-0.5" : "hover:translate-x-0.5"
                )}
              >
                {btn.symbol && <span className="text-muted-foreground">{btn.symbol}</span>}
                <span className="truncate">{btn.label}</span>
              </button>
            </SortableWrapper>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
