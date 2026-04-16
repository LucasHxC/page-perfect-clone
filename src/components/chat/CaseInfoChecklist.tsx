import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type TriStateValue = 'yes' | 'no' | null;
type ClassifierBy = 'Bot' | 'Agent' | null;
type GuidanceFrom = 'SME' | 'Lead' | 'QA' | 'Trainer' | null;

interface CaseInfo {
  botActionedFirst: TriStateValue;
  botAction: string;
  compromised: TriStateValue;
  compClassifierUsed: TriStateValue;
  compClassifierBy: ClassifierBy;
  disabledAccount: TriStateValue;
  resolvabilityActions: string;
  loginConfirmedTimeline: TriStateValue;
  loginConfirmedChat: TriStateValue;
  guidance: TriStateValue;
  guidanceFrom: GuidanceFrom;
  guidanceName: string;
  guidanceReceived: string;
  toolingErrors: TriStateValue;
  agentComments: string;
  recoveryActionTaken: TriStateValue;
  recoverySUAFull: boolean;
  recoverySUAPartial: boolean;
  recoverySUAPartialDetail: string;
  recoverySendPRL: boolean;
  recoverySendPRLDetail: string;
  recoveryGenerate2FA: boolean;
  recoveryUnenrollCheckpoint: boolean;
  recoveryOneClick: boolean;
}

const defaultCaseInfo: CaseInfo = {
  botActionedFirst: null, botAction: '', compromised: null, compClassifierUsed: null,
  compClassifierBy: null, disabledAccount: null, resolvabilityActions: '',
  loginConfirmedTimeline: null, loginConfirmedChat: null, guidance: null,
  guidanceFrom: null, guidanceName: '', guidanceReceived: '', toolingErrors: null,
  agentComments: '', recoveryActionTaken: null, recoverySUAFull: false,
  recoverySUAPartial: false, recoverySUAPartialDetail: '', recoverySendPRL: false,
  recoverySendPRLDetail: '', recoveryGenerate2FA: false, recoveryUnenrollCheckpoint: false,
  recoveryOneClick: false,
};

function displayVal(v: TriStateValue): string {
  if (v === 'yes') return 'Yes';
  if (v === 'no') return 'No';
  return '—';
}

function YesNoGroup({ value, onChange }: { value: TriStateValue; onChange: (v: TriStateValue) => void }) {
  const options: Array<{ label: string; val: TriStateValue }> = [
    { label: 'Yes', val: 'yes' }, { label: 'No', val: 'no' }
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

function CheckOption({ label, checked, onChange, children }: { label: string; checked: boolean; onChange: (v: boolean) => void; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "px-2 py-0.5 h-6 text-xs rounded-md border transition-all min-w-[44px]",
          checked ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:opacity-90"
        )}
      >
        {checked ? '✓' : '○'} {label}
      </button>
      {checked && children}
    </div>
  );
}

export function CaseInfoChecklist() {
  const [info, setInfo] = useState<CaseInfo>({ ...defaultCaseInfo });

  const update = useCallback(<K extends keyof CaseInfo>(key: K, val: CaseInfo[K]) => {
    setInfo(prev => ({ ...prev, [key]: val }));
  }, []);

  const generateOutput = () => {
    const lines: string[] = [];
    lines.push('Investigation:');
    lines.push(`Bot actioned first - ${displayVal(info.botActionedFirst)}${info.botActionedFirst === 'yes' && info.botAction ? ` - ${info.botAction}` : ''}`);
    lines.push(`Compromised - ${displayVal(info.compromised)}`);
    lines.push(`Comp Classifier used - ${displayVal(info.compClassifierUsed)}${info.compClassifierUsed === 'yes' && info.compClassifierBy ? ` - By ${info.compClassifierBy}` : ''}`);
    lines.push(`Disabled account - ${displayVal(info.disabledAccount)}`);

    lines.push('');
    lines.push(`Resolvability Actions Taken: ${info.resolvabilityActions || '—'}`);

    lines.push('');
    lines.push('Confirmed user login after resolution:');
    lines.push(`Confirmed user login via Activity Timeline/Centra: ${displayVal(info.loginConfirmedTimeline)}`);
    lines.push(`Confirmed user login via Chat/Email: ${displayVal(info.loginConfirmedChat)}`);

    lines.push(`Guidance: ${displayVal(info.guidance)}${info.guidance === 'yes' ? ` - ${info.guidanceFrom || '—'} - ${info.guidanceName || '—'} - ${info.guidanceReceived || '—'}` : ''}`);
    lines.push(`Tooling errors/bugs: ${displayVal(info.toolingErrors)}`);
    lines.push(`Agent comments/feedback: ${info.agentComments || '—'}`);

    lines.push('');
    lines.push(`Recovery Action Taken: ${displayVal(info.recoveryActionTaken)}`);

    if (info.recoveryActionTaken === 'yes') {
      const types: string[] = [];
      if (info.recoverySUAFull) types.push("SUA Full (all boxes checked except 'Enroll to Hacked Lock')");
      if (info.recoverySUAPartial) types.push(`SUA Partial (${info.recoverySUAPartialDetail || '—'})`);
      if (info.recoverySendPRL) types.push(`Send PRL (${info.recoverySendPRLDetail || '—'})`);
      if (info.recoveryGenerate2FA) types.push('Generate 2FA');
      if (info.recoveryUnenrollCheckpoint) types.push('Unenroll from Checkpoint');
      if (info.recoveryOneClick) types.push('One-Click Recovery');
      lines.push(`Recovery Action Type: ${types.length > 0 ? types.join(', ') : '—'}`);
    }

    return lines.join('\n');
  };

  const applyPreset = (type: 'notCompBot' | 'notCompAgent' | 'compBot' | 'compAgent') => {
    const isComp = type === 'compBot' || type === 'compAgent';
    const isAgent = type === 'notCompAgent' || type === 'compAgent';
    setInfo({
      ...defaultCaseInfo,
      botActionedFirst: 'yes', compromised: isComp ? 'yes' : 'no',
      compClassifierUsed: 'yes', compClassifierBy: isAgent ? 'Agent' : 'Bot',
      disabledAccount: 'no', guidance: 'no', toolingErrors: 'no',
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
  const sectionHeader = "text-xs font-semibold text-foreground mt-4 mb-2 uppercase tracking-wide";
  const inputClass = "px-2 py-0.5 h-6 text-xs border border-border rounded-md bg-muted text-foreground focus:outline-none focus:border-primary";

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

      {/* Investigation */}
      <p className={sectionHeader}>🔍 Investigation</p>

      <div className={rowClass}>
        <span className={labelClass}>Bot actioned first:</span>
        <YesNoGroup value={info.botActionedFirst} onChange={v => update('botActionedFirst', v)} />
        {info.botActionedFirst === 'yes' && (
          <input type="text" value={info.botAction} onChange={e => update('botAction', e.target.value)} placeholder="What did it do?" className={cn(inputClass, "flex-1 min-w-[150px]")} />
        )}
      </div>

      <div className={rowClass}>
        <span className={labelClass}>Compromised:</span>
        <YesNoGroup value={info.compromised} onChange={v => update('compromised', v)} />
      </div>

      <div className={rowClass}>
        <span className={labelClass}>Comp Classifier used:</span>
        <YesNoGroup value={info.compClassifierUsed} onChange={v => update('compClassifierUsed', v)} />
        {info.compClassifierUsed === 'yes' && (
          <RoleButtons options={['Bot', 'Agent']} value={info.compClassifierBy} onChange={v => update('compClassifierBy', v as ClassifierBy)} />
        )}
      </div>

      <div className={rowClass}>
        <span className={labelClass}>Disabled account:</span>
        <YesNoGroup value={info.disabledAccount} onChange={v => update('disabledAccount', v)} />
      </div>

      {/* Resolvability Actions Taken */}
      <div className="border-t border-border mt-3 pt-3">
        <p className={sectionHeader}>📋 Resolvability Actions Taken</p>
        <textarea
          value={info.resolvabilityActions}
          onChange={e => update('resolvabilityActions', e.target.value)}
          placeholder="List actions taken..."
          className="px-2 py-1.5 text-xs border border-border rounded-md bg-muted text-foreground min-h-[50px] resize-y w-full font-[inherit] focus:outline-none focus:border-primary"
        />
      </div>

      {/* Confirmed user login after resolution */}
      <div className="border-t border-border mt-3 pt-3">
        <p className={sectionHeader}>✅ Confirmed user login after resolution</p>
        <div className="pl-4 border-l-2 border-primary/30 space-y-2">
          <div className={rowClass}>
            <span className="text-xs text-muted-foreground min-w-[200px]">Via Activity Timeline/Centra:</span>
            <YesNoGroup value={info.loginConfirmedTimeline} onChange={v => update('loginConfirmedTimeline', v)} />
          </div>
          <div className={rowClass}>
            <span className="text-xs text-muted-foreground min-w-[200px]">Via Chat/Email:</span>
            <YesNoGroup value={info.loginConfirmedChat} onChange={v => update('loginConfirmedChat', v)} />
          </div>
        </div>
      </div>

      {/* Guidance, Tooling, Comments */}
      <div className="border-t border-border mt-3 pt-3">
        <div className={cn(rowClass, "mt-2")}>
          <span className={labelClass}>Guidance:</span>
          <YesNoGroup value={info.guidance} onChange={v => update('guidance', v)} />
          {info.guidance === 'yes' && (
            <div className="flex gap-1.5 flex-wrap items-center">
              <RoleButtons options={['SME', 'Lead', 'QA', 'Trainer']} value={info.guidanceFrom} onChange={v => update('guidanceFrom', v as GuidanceFrom)} />
              <input type="text" value={info.guidanceName} onChange={e => update('guidanceName', e.target.value)} placeholder="Name" className={cn(inputClass, "w-24")} />
              <input type="text" value={info.guidanceReceived} onChange={e => update('guidanceReceived', e.target.value)} placeholder="Guidance received" className={cn(inputClass, "flex-1 min-w-[120px]")} />
            </div>
          )}
        </div>

        <div className={rowClass}>
          <span className={labelClass}>Tooling errors/bugs:</span>
          <YesNoGroup value={info.toolingErrors} onChange={v => update('toolingErrors', v)} />
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
      </div>

      {/* Recovery Action */}
      <div className="border-t border-border mt-3 pt-3">
        <p className={sectionHeader}>🔧 Recovery Action</p>
        <div className={rowClass}>
          <span className={labelClass}>Recovery Action Taken:</span>
          <YesNoGroup value={info.recoveryActionTaken} onChange={v => update('recoveryActionTaken', v)} />
        </div>

        {info.recoveryActionTaken === 'yes' && (
          <div className="pl-4 border-l-2 border-primary/30 space-y-2 mt-2">
            <p className="text-xs text-muted-foreground mb-2">Recovery Action Type (select all that apply):</p>
            <CheckOption label="SUA Full" checked={info.recoverySUAFull} onChange={v => update('recoverySUAFull', v)}>
              <span className="text-[0.65rem] text-muted-foreground italic">(all boxes checked except 'Enroll to Hacked Lock')</span>
            </CheckOption>
            <CheckOption label="SUA Partial" checked={info.recoverySUAPartial} onChange={v => update('recoverySUAPartial', v)}>
              <input type="text" value={info.recoverySUAPartialDetail} onChange={e => update('recoverySUAPartialDetail', e.target.value)} placeholder="Which actions/boxes were checked" className={cn(inputClass, "flex-1 min-w-[180px]")} />
            </CheckOption>
            <CheckOption label="Send PRL" checked={info.recoverySendPRL} onChange={v => update('recoverySendPRL', v)}>
              <input type="text" value={info.recoverySendPRLDetail} onChange={e => update('recoverySendPRLDetail', e.target.value)} placeholder="Which type was used" className={cn(inputClass, "flex-1 min-w-[180px]")} />
            </CheckOption>
            <CheckOption label="Generate 2FA" checked={info.recoveryGenerate2FA} onChange={v => update('recoveryGenerate2FA', v)} />
            <CheckOption label="Unenroll from Checkpoint" checked={info.recoveryUnenrollCheckpoint} onChange={v => update('recoveryUnenrollCheckpoint', v)} />
            <CheckOption label="One-Click Recovery" checked={info.recoveryOneClick} onChange={v => update('recoveryOneClick', v)} />
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="mt-4 p-2.5 bg-muted rounded-md text-[0.7rem] font-mono whitespace-pre-line text-muted-foreground">
        {generateOutput()}
      </div>
    </div>
  );
}
