import { useState, useCallback } from 'react';
import { TemplateItem } from '@/data/chatTemplates';

interface AppState {
  clientName: string;
  caseId: string;
  agentAlias: string;
}

export function useTemplateState() {
  const [state, setState] = useState<AppState>({
    clientName: '',
    caseId: '',
    agentAlias: localStorage.getItem('selectedAgent') || 'James',
  });

  const processContent = useCallback((content: string) => {
    let processed = content;

    if (state.clientName.trim()) {
      processed = processed
        .replace(/\[Clients Name\]/gi, state.clientName)
        .replace(/\[Client Name\]/gi, state.clientName)
        .replace(/\[Client's Name\]/gi, state.clientName);
    }

    processed = processed.replace(/Agent_name/g, state.agentAlias);

    if (state.caseId.trim()) {
      processed = processed.replace(/your case ID is \{case_id\}\. ?/gi, `your case ID is ${state.caseId}. `);
    } else {
      processed = processed.replace(/your case ID is \{case_id\}\. ?/gi, '');
    }

    const authCode =
      state.caseId && state.caseId.length >= 5
        ? state.caseId.slice(-5)
        : '{auth_code}';
    processed = processed.replace(/\{auth_code\}/gi, authCode);

    return processed;
  }, [state]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { state, setState, processContent, copyToClipboard };
}
