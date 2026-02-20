import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type TriStateValue = 'yes' | 'no' | 'na' | null;
type ClassifierBy = 'Bot' | 'Agent' | null;
type GuidanceFrom = 'SME' | 'Lead' | 'QA' | 'Trainer' | null;

interface CaseInfo {
  botActionedFirst: TriStateValue;
  botAction: string;
  compromised: TriStateValue;
  compClassifierUsed: TriStateValue;
  compClassifierBy: ClassifierBy;
  disabledAccount: TriStateValue;
  showLoginSection: boolean;
  loginConfirmedTimeline: TriStateValue;
  loginConfirmedChat: TriStateValue;
  guidance: TriStateValue;
  guidanceFrom: GuidanceFrom;
  guidanceName: string;
  guidanceReceived: string;
  toolingErrors: TriStateValue;
  agentComments: string;
}

const defaultCaseInfo: CaseInfo = {
  botActionedFirst: null, botAction: '', compromised: null, compClassifierUsed: null,
  compClassifierBy: null, disabledAccount: null, showLoginSection: false,
  loginConfirmedTimeline: null, loginConfirmedChat: null, guidance: null,
  guidanceFrom: null, guidanceName: '', guidanceReceived: '', toolingErrors: null, agentComments: ''
};

function displayVal(v: TriStateValue): string {
  if (v === 'yes') return 'Yes';
  if (v === 'no') return 'No';
  if (v === 'na') return 'N/A';
  return '—';
}

function TriStateGroup({ field, value, onChange }: { field: string; value: TriStateValue; onChange: (v: TriStateValue) => void }) {
  const options: Array<{ label: string; val: TriStateValue }> = [
    { label: 'Yes', val: 'yes' }, { label: 'No', val: 'no' }, { label: 'N/A', val: 'na' }
  ];
  return (
    <div className="flex gap-1">
      {options.map(opt => (
        <button
          key={opt.val}
          onClick={() => onChange(value === opt.val ? null : opt.val)}
          className={cn(
            "px-2 py-0.5 h-6 text-xs rounded-md border transition-all duration-150 min-w-[44px]",
          value === opt.val && opt.val === 'yes' && "bg-[#16a34a] text-white border-[#16a34a]",
            value === opt.val && opt.val === 'no' && "bg-destructive text-destructive-foreground border-destructive",
            value === opt.val && opt.val === 'na' && "bg-[#f97316] text-white border-[#f97316]",
            value !== opt.val && "bg-muted text-muted-foreground border-border hover:opacity-90"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function RoleButtons({ options, value, onChange }: { options: string[]; value: string | null; onChange: (v: string | null) => void }) {
  return (
    <div className="flex gap-1">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(value === opt ? null : opt)}
          className={cn(
            "px-1.5 py-0.5 h-6 text-[0.7rem] rounded-md border transition-all min-w-[44px]",
            value === opt ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-foreground border-border hover:bg-secondary"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function CaseInfoChecklist() {
  const [info, setInfo] = useState<CaseInfo>({ ...defaultCaseInfo });

  const update = useCallback(<K extends keyof CaseInfo>(key: K, val: CaseInfo[K]) => {
    setInfo(prev => ({ ...prev, [key]: val }));
  }, []);

  const generateOutput = () => {
    const lines = [
      `Bot actioned first - ${displayVal(info.botActionedFirst)}${info.botActionedFirst === 'yes' && info.botAction ? ` - ${info.botAction}` : ''}`,
      `Compromised - ${displayVal(info.compromised)}`,
      `Comp Classifier used - ${displayVal(info.compClassifierUsed)}${info.compClassifierUsed === 'yes' && info.compClassifierBy ? ` - By ${info.compClassifierBy}` : ''}`,
      `Disabled account - ${displayVal(info.disabledAccount)}`,
    ];
    if (info.showLoginSection) {
      lines.push('', 'Confirmed user login after resolution:');
      lines.push(`Confirmed user login via Activity Timeline/ Centra: ${displayVal(info.loginConfirmedTimeline)}`);
      lines.push(`Confirmed user login via Chat/Email: ${displayVal(info.loginConfirmedChat)}`);
    }
    lines.push(`Guidance: ${displayVal(info.guidance)}${info.guidance === 'yes' ? ` - ${info.guidanceFrom || '—'} - ${info.guidanceName || '—'} - ${info.guidanceReceived || '—'}` : ''}`);
    lines.push(`Tooling errors/bugs: ${displayVal(info.toolingErrors)}`);
    lines.push(`Agent comments/feedback: ${info.agentComments || '—'}`);
    return lines.join('\n');
  };

  const applyPreset = (type: 'notCompBot' | 'notCompAgent' | 'compBot' | 'compAgent') => {
    const isComp = type === 'compBot' || type === 'compAgent';
    const isAgent = type === 'notCompAgent' || type === 'compAgent';
    setInfo({
      botActionedFirst: 'yes', botAction: '', compromised: isComp ? 'yes' : 'no',
      compClassifierUsed: 'yes', compClassifierBy: isAgent ? 'Agent' : 'Bot',
      disabledAccount: 'no', showLoginSection: false, loginConfirmedTimeline: null,
      loginConfirmedChat: null, guidance: 'no', guidanceFrom: null, guidanceName: '',
      guidanceReceived: '', toolingErrors: 'no', agentComments: ''
    });
    const labels = { notCompBot: 'Not Compromised by Bot', notCompAgent: 'Not Compromised by Agent', compBot: 'Compromised by Bot', compAgent: 'Compromised by Agent' };
    toast.success(`Preset applied: ${labels[type]}`);
  };

  const handleCopyCaseInfo = async () => {
    try {
      await navigator.clipboard.writeText(generateOutput());
      toast.success('Case info copied!');
    } catch { toast.error('Failed to copy'); }
  };

  const rowClass = "flex items-center gap-3 mb-3 flex-wrap";
  const labelClass = "text-xs text-muted-foreground min-w-[140px]";

  return (
    <div id="case-info-checklist" className="bg-card border-2 border-border rounded-2xl p-6 mt-8 shadow-lg">
      {/* Preset Buttons */}
      <div className="flex gap-2 flex-wrap mb-4 pb-3 border-b border-border">
        <button onClick={() => applyPreset('notCompBot')} className="px-2.5 py-1 text-xs rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition">🤖 Not Comp. by Bot</button>
        <button onClick={() => applyPreset('notCompAgent')} className="px-2.5 py-1 text-xs rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition">👤 Not Comp. by Agent</button>
        <button onClick={() => applyPreset('compBot')} className="px-2.5 py-1 text-xs rounded-md bg-destructive text-destructive-foreground font-medium hover:opacity-90 transition">⚠️ Comp. by Bot</button>
        <button onClick={() => applyPreset('compAgent')} className="px-2.5 py-1 text-xs rounded-md bg-destructive text-destructive-foreground font-medium hover:opacity-90 transition">⚠️ Comp. by Agent</button>
        <button onClick={() => setInfo({ ...defaultCaseInfo })} className="px-2.5 py-1 text-xs rounded-md bg-secondary text-secondary-foreground font-medium hover:opacity-90 transition">↺ Reset</button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-foreground">Case Info Checklist</h3>
        <button onClick={handleCopyCaseInfo} className="px-2.5 py-1 text-xs rounded-md border border-border bg-transparent text-foreground hover:bg-secondary transition flex items-center gap-1">
          📋 Copy
        </button>
      </div>

      {/* Rows */}
      <div className={rowClass}>
        <span className={labelClass}>Bot actioned first:</span>
        <TriStateGroup field="botActionedFirst" value={info.botActionedFirst} onChange={v => update('botActionedFirst', v)} />
        {info.botActionedFirst === 'yes' && (
          <input type="text" value={info.botAction} onChange={e => update('botAction', e.target.value)} placeholder="What did it do?" className="flex-1 px-2 py-0.5 h-6 text-xs border border-border rounded-md bg-muted text-foreground min-w-[150px] focus:outline-none focus:border-primary" />
        )}
      </div>

      <div className={rowClass}>
        <span className={labelClass}>Compromised:</span>
        <TriStateGroup field="compromised" value={info.compromised} onChange={v => update('compromised', v)} />
      </div>

      <div className={rowClass}>
        <span className={labelClass}>Comp Classifier used:</span>
        <TriStateGroup field="compClassifierUsed" value={info.compClassifierUsed} onChange={v => update('compClassifierUsed', v)} />
        {info.compClassifierUsed === 'yes' && (
          <RoleButtons options={['Bot', 'Agent']} value={info.compClassifierBy} onChange={v => update('compClassifierBy', v as ClassifierBy)} />
        )}
      </div>

      <div className={rowClass}>
        <span className={labelClass}>Disabled account:</span>
        <TriStateGroup field="disabledAccount" value={info.disabledAccount} onChange={v => update('disabledAccount', v)} />
      </div>

      {/* Login section toggle */}
      <div className="border-t border-border mt-3 pt-3">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => update('showLoginSection', !info.showLoginSection)}
            className={cn("px-2.5 py-1 text-xs rounded-md border transition font-medium", info.showLoginSection ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:bg-secondary")}
          >
            Confirmed login after solution
          </button>
          {info.showLoginSection && (
            <button
              onClick={async () => {
                const t = `Confirmed user login via Activity Timeline/ Centra: ${displayVal(info.loginConfirmedTimeline)}\nConfirmed user login via Chat/Email: ${displayVal(info.loginConfirmedChat)}`;
                await navigator.clipboard.writeText(t);
                toast.success('Login section copied!');
              }}
              className="px-2.5 py-1 text-xs rounded-md border border-border text-foreground hover:bg-secondary transition"
            >
              📋 Copy
            </button>
          )}
        </div>
        {info.showLoginSection && (
          <div className="pl-4 border-l-2 border-primary/30 mt-2 space-y-2">
            <div className={rowClass}>
              <span className="text-xs text-muted-foreground min-w-[200px]">Via Activity Timeline/Centra:</span>
              <TriStateGroup field="loginConfirmedTimeline" value={info.loginConfirmedTimeline} onChange={v => update('loginConfirmedTimeline', v)} />
            </div>
            <div className={rowClass}>
              <span className="text-xs text-muted-foreground min-w-[200px]">Via Chat/Email:</span>
              <TriStateGroup field="loginConfirmedChat" value={info.loginConfirmedChat} onChange={v => update('loginConfirmedChat', v)} />
            </div>
          </div>
        )}
      </div>

      <div className={cn(rowClass, "mt-3")}>
        <span className={labelClass}>Guidance:</span>
        <TriStateGroup field="guidance" value={info.guidance} onChange={v => update('guidance', v)} />
        {info.guidance === 'yes' && (
          <div className="flex gap-1.5 flex-wrap items-center">
            <RoleButtons options={['SME', 'Lead', 'QA', 'Trainer']} value={info.guidanceFrom} onChange={v => update('guidanceFrom', v as GuidanceFrom)} />
            <input type="text" value={info.guidanceName} onChange={e => update('guidanceName', e.target.value)} placeholder="Name" className="w-24 px-2 py-0.5 h-6 text-xs border border-border rounded-md bg-muted text-foreground focus:outline-none focus:border-primary" />
            <input type="text" value={info.guidanceReceived} onChange={e => update('guidanceReceived', e.target.value)} placeholder="Guidance received" className="flex-1 min-w-[120px] px-2 py-0.5 h-6 text-xs border border-border rounded-md bg-muted text-foreground focus:outline-none focus:border-primary" />
          </div>
        )}
      </div>

      <div className={rowClass}>
        <span className={labelClass}>Tooling errors/bugs:</span>
        <TriStateGroup field="toolingErrors" value={info.toolingErrors} onChange={v => update('toolingErrors', v)} />
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <span className={labelClass}>Agent comments/feedback:</span>
          <div className="flex gap-1.5">
            <button onClick={() => update('agentComments', 'chat paused')} className="px-2 py-0.5 text-[0.7rem] rounded border border-border bg-secondary text-secondary-foreground hover:opacity-90 transition">⏸️ Chat Paused</button>
            <button onClick={() => update('agentComments', '')} className="px-2 py-0.5 text-[0.7rem] rounded border border-border bg-secondary text-secondary-foreground hover:opacity-90 transition">Clear</button>
          </div>
        </div>
        <textarea
          value={info.agentComments}
          onChange={e => update('agentComments', e.target.value)}
          placeholder="Enter comments..."
          className="px-2 py-1.5 text-xs border border-border rounded-md bg-muted text-foreground min-h-[50px] resize-y w-full font-[inherit] focus:outline-none focus:border-primary"
        />
      </div>

      {/* Preview */}
      <div className="mt-3 p-2.5 bg-muted rounded-md text-[0.7rem] font-mono whitespace-pre-line text-muted-foreground">
        {generateOutput()}
      </div>
    </div>
  );
}
