import { useState, useEffect, useCallback, useRef } from 'react';
import { chatTemplates, leftSidebarButtons, rightSidebarButtons, quickNavButtons, agents, type TemplateItem } from '@/data/chatTemplates';
import { AccordionSection } from '@/components/chat/AccordionSection';
import { SidebarPanel } from '@/components/chat/SidebarPanel';
import { CaseInfoChecklist } from '@/components/chat/CaseInfoChecklist';
import { SortableWrapper } from '@/components/chat/SortableWrapper';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function ChatTemplatesPage() {
  const [clientName, setClientName] = useState('');
  const [caseId, setCaseId] = useState('');
  const [agentAlias, setAgentAlias] = useState(() => localStorage.getItem('selectedAgent') || agents[0]);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [sectionOrder, setSectionOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('section-order');
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        const valid = ids.filter(id => chatTemplates.some(s => s.id === id));
        const missing = chatTemplates.map(s => s.id).filter(id => !valid.includes(id));
        return [...valid, ...missing];
      }
    } catch {}
    return chatTemplates.map(s => s.id);
  });
  const clientNameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clientNameHeaderRef = useRef<HTMLInputElement>(null);
  const clientNameMainRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('section-order', JSON.stringify(sectionOrder));
  }, [sectionOrder]);

  const [customItems, setCustomItems] = useState<Record<string, TemplateItem[]>>(() => {
    try {
      return JSON.parse(localStorage.getItem('custom-crs') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('custom-crs', JSON.stringify(customItems));
  }, [customItems]);

  const addCustomItem = (sectionId: string, content: string, notes?: string) => {
    const newItem: TemplateItem = { id: `custom-${Date.now()}`, content, notes, custom: true };
    setCustomItems(prev => ({ ...prev, [sectionId]: [...(prev[sectionId] || []), newItem] }));
    toast.success('New CR added');
  };

  const removeCustomItem = (sectionId: string, itemId: string) => {
    setCustomItems(prev => ({ ...prev, [sectionId]: (prev[sectionId] || []).filter(i => i.id !== itemId) }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleSectionDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setSectionOrder(order => {
      const oldIndex = order.indexOf(active.id as string);
      const newIndex = order.indexOf(over.id as string);
      return arrayMove(order, oldIndex, newIndex);
    });
  };

  // Apply dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Process template content with placeholders
  const processContent = useCallback((content: string) => {
    let processed = content;
    if (clientName.trim()) {
      processed = processed
        .replace(/\[Clients Name\]/gi, clientName)
        .replace(/\[Client Name\]/gi, clientName)
        .replace(/\[Client's Name\]/gi, clientName);
    }
    processed = processed.replace(/Agent_name/g, agentAlias);
    if (caseId.trim()) {
      processed = processed.replace(/your case ID is \{case_id\}\. ?/gi, `your case ID is ${caseId}. `);
    } else {
      processed = processed.replace(/your case ID is \{case_id\}\. ?/gi, '');
    }
    const authCode = caseId && caseId.length >= 5 ? caseId.slice(-5) : '{auth_code}';
    processed = processed.replace(/\{auth_code\}/gi, authCode);
    return processed;
  }, [clientName, agentAlias, caseId]);

  const handleClientNameChange = (value: string) => {
    setClientName(value);
  };

  const handleAgentChange = (value: string) => {
    setAgentAlias(value);
    localStorage.setItem('selectedAgent', value);
  };

  // Apply persisted section order and merge in custom CRs
  const orderedTemplates = sectionOrder
    .map(id => {
      const section = chatTemplates.find(s => s.id === id);
      if (!section) return undefined;
      return { ...section, items: [...section.items, ...(customItems[id] || [])] };
    })
    .filter(Boolean) as typeof chatTemplates;

  // Filter templates based on search
  const filteredTemplates = searchQuery.trim()
    ? orderedTemplates
        .map(section => ({
          ...section,
          items: section.items.filter(
            item =>
              item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
              section.title.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter(s => s.items.length > 0)
    : orderedTemplates;

  const toggleSection = (id: string) => {
    setOpenSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const allOpen = openSections.length === chatTemplates.length;
  const toggleAll = () => {
    if (allOpen) {
      setOpenSections([]);
    } else {
      setOpenSections(chatTemplates.map(s => s.id));
    }
  };

  const navigateToSection = (sectionId: string) => {
    if (sectionId === 'case-info-checklist') {
      document.getElementById('case-info-checklist')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (!openSections.includes(sectionId)) {
      setOpenSections(prev => [...prev, sectionId]);
    }
    setTimeout(() => {
      const el = document.getElementById(`section-${sectionId}`);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 175;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleQuickNavChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      navigateToSection(val);
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex items-end justify-between gap-2 px-3 py-2 max-w-[1536px] mx-auto min-h-[60px] flex-wrap">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center justify-center h-9 w-9 rounded-[10px] text-xl" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))' }}>
              💬
            </div>
          </div>

          {/* Quick Nav */}
          <div className="flex flex-col gap-0.5 min-w-[170px]">
            <label className="text-[0.65rem] font-medium text-muted-foreground">Quick Nav</label>
            <select
              onChange={handleQuickNavChange}
              className="px-2 py-1 h-8 text-xs border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary"
            >
              <option value="">Jump to section...</option>
              {chatTemplates.map(s => (
                <option key={s.id} value={s.id}>{s.icon} {s.title}</option>
              ))}
              <option value="case-info-checklist">📋 Case Info Checklist</option>
            </select>
          </div>

          {/* Case ID */}
          <div className="flex flex-col gap-0.5 min-w-[120px]">
            <label className="text-[0.65rem] font-medium text-muted-foreground">Case ID</label>
            <input
              type="text"
              placeholder="Case ID..."
              value={caseId}
              onChange={e => setCaseId(e.target.value)}
              className="px-2 py-1 h-7 text-xs border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary min-w-[120px]"
            />
          </div>

          {/* Client Name */}
          <div className="flex flex-col gap-0.5 min-w-[140px]">
            <label className="text-[0.65rem] font-medium text-muted-foreground">Client</label>
            <input
              ref={clientNameHeaderRef}
              type="text"
              placeholder="Client name..."
              value={clientName}
              onChange={e => handleClientNameChange(e.target.value)}
              className="px-2 py-1 h-7 text-xs border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary min-w-[140px]"
            />
          </div>

          {/* Quick Nav Buttons */}
          <div className="flex gap-1.5 self-end">
            {quickNavButtons.map(btn => (
              <button
                key={btn.sectionId}
                onClick={() => navigateToSection(btn.sectionId)}
                className="px-2 py-1 text-[0.7rem] rounded-lg border border-border text-foreground bg-transparent hover:bg-secondary transition whitespace-nowrap font-medium"
              >
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-1.5 self-end">
            <select
              value={agentAlias}
              onChange={e => handleAgentChange(e.target.value)}
              className="px-2 py-1 h-7 text-xs border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary font-medium"
            >
              {agents.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <button
              onClick={toggleAll}
              className="px-2 py-1 h-7 text-xs border-2 border-border rounded-lg bg-secondary text-foreground hover:bg-muted transition font-medium whitespace-nowrap"
            >
              {allOpen ? '▲ Collapse' : '▼ Expand'}
            </button>
          </div>
        </div>
      </header>

      {/* Left Sidebar */}
      <SidebarPanel buttons={leftSidebarButtons} processContent={processContent} side="left" />

      {/* Right Sidebar */}
      <SidebarPanel buttons={rightSidebarButtons} processContent={processContent} side="right" />

      {/* Main Content */}
      <main className="max-w-[700px] mx-auto px-4 pt-6 pb-12">
        {/* Client Name Input (main) */}
        <div className="mb-5">
          <input
            ref={clientNameMainRef}
            type="text"
            value={clientName}
            onChange={e => handleClientNameChange(e.target.value)}
            placeholder="Enter client's name..."
            className="w-full px-3 py-2.5 border-2 border-border rounded-xl bg-card text-foreground text-sm focus:outline-none focus:border-primary transition shadow-sm"
          />
        </div>

        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="🔍 Search templates..."
            className="w-full px-4 py-2.5 border-2 border-border rounded-xl bg-card text-foreground text-sm focus:outline-none focus:border-primary transition shadow-sm"
          />
          {searchQuery && (
            <p className="text-xs text-muted-foreground mt-1.5">
              Found {filteredTemplates.reduce((a, s) => a + s.items.length, 0)} templates in {filteredTemplates.length} sections
            </p>
          )}
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {filteredTemplates.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground mb-2">No templates found for "{searchQuery}"</p>
              <button onClick={() => setSearchQuery('')} className="text-primary hover:underline text-sm">Clear search</button>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
              <SortableContext items={filteredTemplates.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {filteredTemplates.map((section, i) => (
                  <SortableWrapper key={section.id} id={section.id}>
                    <AccordionSection
                      section={section}
                      isOpen={openSections.includes(section.id) || (searchQuery.trim() !== '')}
                      onToggle={() => toggleSection(section.id)}
                      processContent={processContent}
                      caseId={caseId}
                      animationDelay={200 + i * 50}
                      onAddItem={addCustomItem}
                      onRemoveItem={removeCustomItem}
                    />
                  </SortableWrapper>
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Case Info Checklist */}
        <CaseInfoChecklist />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-sm text-muted-foreground">Meta Support Chat Template Reference</p>
      </footer>

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        title="Toggle Dark Mode"
        className="fixed bottom-6 right-48 z-50 p-2.5 rounded-xl bg-card border-2 border-border shadow-xl transition-all hover:-translate-y-0.5 hover:border-primary text-xl"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
