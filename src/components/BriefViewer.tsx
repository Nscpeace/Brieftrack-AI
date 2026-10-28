import React, { useState } from 'react';
import { MeetingEvent } from '../types';
import {
  FileText,
  Copy,
  Check,
  Printer,
  Sparkles,
  Users,
  Mail,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface BriefViewerProps {
  meetings: MeetingEvent[];
  selectedMeetingId: string;
  onSelectMeeting: (meetingId: string) => void;
  onRegenerateBrief: (meetingId: string) => void;
  onNavigateToTranscript: (meetingId: string) => void;
  isRegenerating?: boolean;
}

export const BriefViewer: React.FC<BriefViewerProps> = ({
  meetings,
  selectedMeetingId,
  onSelectMeeting,
  onRegenerateBrief,
  onNavigateToTranscript,
  isRegenerating = false,
}) => {
  const [copied, setCopied] = useState(false);

  const meeting = meetings.find((m) => m.id === selectedMeetingId) || meetings[0];
  const brief = meeting?.brief;

  const handleCopy = () => {
    if (!brief || !meeting) return;
    const text = `PRE-MEETING EXECUTIVE BRIEF: ${meeting.title}
Client: ${meeting.clientName}
Scheduled: ${meeting.scheduledDate} (${meeting.durationMinutes} min)

OBJECTIVE:
${brief.keyObjective}

EXECUTIVE SUMMARY:
${brief.executiveSummary}

KEY ATTENDEES:
${brief.attendeeDossier.map((a) => `- ${a.name} (${a.recentSentiment}): ${a.notes}`).join('\n')}

RECENT INTERACTIONS:
${brief.recentInteractions.map((i) => `- [${i.date}] (${i.channel}): ${i.summary}`).join('\n')}

OPEN HISTORICAL COMMITMENTS:
${brief.openHistoricalActions.map((a) => `- ${a.title} (Owner: ${a.assignee}, Due: ${a.dueDate})`).join('\n')}

TALKING POINTS:
${brief.recommendedTalkingPoints.map((tp, idx) => `${idx + 1}. ${tp}`).join('\n')}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!meeting) {
    return (
      <div className="text-center py-12 bg-white border border-slate-200 rounded-xl p-8">
        <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-600">No meeting selected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Meeting Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-blue-700">{meeting.clientName}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{meeting.scheduledDate}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Pre-Meeting Executive Briefing Pack
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            title="Copy formatted briefing to clipboard for Slack or email"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Dossier</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={() => onRegenerateBrief(meeting.id)}
            disabled={isRegenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Refreshing...' : 'Regenerate Brief'}</span>
          </button>
        </div>
      </div>

      {/* Meeting Context Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium whitespace-nowrap">Active Session:</span>
        {meetings.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelectMeeting(m.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors border font-medium ${
              m.id === meeting.id
                ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {m.clientName} · {m.scheduledDate.split(',')[0]}
          </button>
        ))}
      </div>

      {!brief ? (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl p-8">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">Briefing pack not compiled yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Run the automated pre-meeting intelligence generator to synthesize prior emails, open actions, and account metrics.
          </p>
          <button
            onClick={() => onRegenerateBrief(meeting.id)}
            disabled={isRegenerating}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Brief Dossier Now</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Objective & Executive Summary Container */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                  Core Strategic Objective
                </span>
                <p className="text-base font-semibold text-slate-900 mt-0.5 leading-snug">
                  {brief.keyObjective}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Executive Background & Context
              </span>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                {brief.executiveSummary}
              </p>
            </div>
          </div>

          {/* Key Figures & Metrics Row */}
          {brief.keyMetrics && brief.keyMetrics.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Health & Key Figures</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {brief.keyMetrics.map((km, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3.5">
                    <div className="text-[11px] text-slate-500 font-medium">{km.label}</div>
                    <div className="text-base font-bold text-slate-900 font-mono tabular-nums mt-1">
                      {km.value}
                    </div>
                    {km.trend && (
                      <div className="text-[11px] text-blue-600 mt-0.5 font-medium">
                        {km.trend}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2-Column Grid: Attendee Dossier & Recent Correspondence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendees & Sentiments */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Key Stakeholder Dossier</span>
              </h2>
              <div className="divide-y divide-slate-100">
                {brief.attendeeDossier.map((att, idx) => {
                  const sentimentColor =
                    att.recentSentiment === 'positive'
                      ? 'text-emerald-700 bg-emerald-50'
                      : att.recentSentiment === 'guarded'
                      ? 'text-amber-700 bg-amber-50'
                      : 'text-slate-600 bg-slate-100';

                  return (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900">{att.name}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${sentimentColor}`}>
                          {att.recentSentiment}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {att.notes}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Email / Slack Interactions */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Recent Communications & Signals</span>
              </h2>
              <div className="space-y-2.5">
                {brief.recentInteractions.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-semibold text-slate-700">{rec.channel}</span>
                      <span className="font-mono tabular-nums text-[11px]">{rec.date}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {rec.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Open Historical Actions & Recommended Talking Points */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Open Historical Actions */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Unresolved Prior Commitments</span>
                </h2>
                <span className="text-[11px] font-mono text-slate-400">
                  {brief.openHistoricalActions.length} open
                </span>
              </div>
              <div className="space-y-2">
                {brief.openHistoricalActions.map((act, idx) => (
                  <div key={idx} className="p-3 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="font-semibold text-slate-900">{act.title}</div>
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <span>Assignee: <strong className="text-slate-700">{act.assignee}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">Due: {act.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Talking Points */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>Recommended Executive Talking Points</span>
              </h2>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {brief.recommendedTalkingPoints.map((tp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-mono text-blue-600 font-bold text-xs shrink-0 mt-0.5">
                      0{idx + 1}.
                    </span>
                    <span className="leading-relaxed">{tp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick link to post-meeting transcript analysis */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-semibold text-blue-900">Meeting Adjourned?</span>
              <p className="text-blue-700 mt-0.5">
                Turn the post-call audio transcript into verified action items and project tasks.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTranscript(meeting.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto shadow-sm"
            >
              <span>Process Meeting Transcript</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
