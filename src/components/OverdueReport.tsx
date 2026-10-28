import React, { useState } from 'react';
import { OverdueTask } from '../types';
import {
  AlertTriangle,
  Mail,
  Copy,
  Check,
  Send,
  Calendar,
  User,
  ShieldAlert,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

interface OverdueReportProps {
  tasks: OverdueTask[];
  onResolveTask: (id: string) => void;
}

export const OverdueReport: React.FC<OverdueReportProps> = ({ tasks, onResolveTask }) => {
  const [filterTier, setFilterTier] = useState<'all' | 'critical' | 'moderate'>('all');
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [draftType, setDraftType] = useState<'slack' | 'email'>('slack');

  const filteredTasks = tasks.filter((t) => {
    if (filterTier === 'critical') return t.daysOverdue >= 5 || t.priority === 'high';
    if (filterTier === 'moderate') return t.daysOverdue < 5;
    return true;
  });

  const criticalCount = tasks.filter((t) => t.daysOverdue >= 5 || t.priority === 'high').length;

  const slackDigest = `🚨 *WEEKLY OVERDUE CLIENT COMMITMENTS AUDIT*
Total Overdue Deliverables: ${tasks.length} (Critical: ${criticalCount})

${tasks
  .map(
    (t, idx) =>
      `*${idx + 1}. [${t.clientName}]* ${t.title}
• Owner: <@${t.assignee}> | Overdue: *${t.daysOverdue} days* (Due ${t.dueDate})
• Risk: ${t.riskTier}
• Latest Update: "${t.lastUpdate}"`
  )
  .join('\n\n')}

⚠️ _Action Required: Please update blockers on shared board before tomorrow morning's executive standup._`;

  const emailDraft = `Subject: URGENT: Weekly Client Deliverable Audit - Action Required

Hi Team,

Below is the weekly overdue audit for active client deliverables as of today:

${tasks
  .map(
    (t) =>
      `• ${t.clientName} — ${t.title}
  Assignee: ${t.assignee} (${t.assigneeEmail})
  Original Due Date: ${t.dueDate} (${t.daysOverdue} days past deadline)
  Risk Assessment: ${t.riskTier}
  Current Status: ${t.lastUpdate}`
  )
  .join('\n\n')}

Please review your respective accounts and reply with an estimated completion date or escalate any technical blockers directly.

Best regards,
Operations & Governance Team`;

  const handleCopyDraft = () => {
    const text = draftType === 'slack' ? slackDigest : emailDraft;
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-rose-700 font-semibold mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Weekly Accountability & Governance</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Overdue Client Commitments Audit
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracks delayed deliverables across all active client accounts with calculated slippage and automated escalation copy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyDraft}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            {copiedDraft ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied {draftType.toUpperCase()} Digest</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy {draftType === 'slack' ? 'Slack' : 'Email'} Escalation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI & Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Overdue Actions
          </span>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {tasks.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Across 3 active enterprise accounts</p>
        </div>

        <div className="bg-white border border-rose-200 rounded-xl p-4 bg-rose-50/20">
          <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">
            Critical Risk Tier
          </span>
          <div className="text-2xl font-bold text-rose-700 font-mono tabular-nums mt-1">
            {criticalCount}
          </div>
          <p className="text-[11px] text-rose-600 mt-0.5">Blocking renewals or production cutovers</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Average Slippage Delta
          </span>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            4.3 Days
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Within 7-day governance threshold</p>
        </div>
      </div>

      {/* Overdue Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
            <button
              onClick={() => setFilterTier('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded ${
                filterTier === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Overdue ({tasks.length})
            </button>
            <button
              onClick={() => setFilterTier('critical')}
              className={`px-2.5 py-1 text-xs font-medium rounded ${
                filterTier === 'critical' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Critical ({criticalCount})
            </button>
          </div>

          <span className="text-slate-400 font-mono text-[11px]">
            Audited on {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTasks.map((t) => (
            <div key={t.id} className="p-4 hover:bg-slate-50 transition-colors space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-700">{t.clientName}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="font-bold text-slate-900 text-sm">{t.title}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded font-bold text-[11px]">
                    +{t.daysOverdue} Days Overdue
                  </span>
                  <button
                    onClick={() => onResolveTask(t.id)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-slate-600 text-[11px]">
                <span className="flex items-center gap-1 font-medium text-slate-800">
                  <User className="w-3 h-3 text-slate-400" />
                  {t.assignee} ({t.assigneeEmail})
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1 font-mono tabular-nums">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Target: {t.dueDate}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-rose-600 font-medium">{t.riskTier}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-100 text-[11px] text-slate-700">
                <strong className="text-slate-500">Current Blocker:</strong> {t.lastUpdate}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation Digest Preview & Format Picker */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Automated Escalation Communication Draft
            </span>
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded">
            <button
              onClick={() => setDraftType('slack')}
              className={`px-2.5 py-1 text-xs font-medium rounded ${
                draftType === 'slack' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Slack Digest
            </button>
            <button
              onClick={() => setDraftType('email')}
              className={`px-2.5 py-1 text-xs font-medium rounded ${
                draftType === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Executive Email
            </button>
          </div>
        </div>

        <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
          {draftType === 'slack' ? slackDigest : emailDraft}
        </pre>
      </div>
    </div>
  );
};
