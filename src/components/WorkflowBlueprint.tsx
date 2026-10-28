import React, { useState } from 'react';
import {
  GitBranch,
  Calendar,
  Sparkles,
  CheckSquare,
  Layers,
  Clock,
  Download,
  Check,
  Code2,
  Cpu,
  ArrowRight,
  Shield,
} from 'lucide-react';

interface BlueprintNode {
  id: string;
  title: string;
  category: 'trigger' | 'ai' | 'gate' | 'router' | 'cron';
  service: string;
  description: string;
  details: {
    event: string;
    payloadSnippet: string;
    promptTemplate?: string;
    errorHandling: string;
  };
}

const BLUEPRINT_NODES: BlueprintNode[] = [
  {
    id: 'node-cal',
    title: 'Calendar Event Detector',
    category: 'trigger',
    service: 'Google Calendar / Outlook API',
    description: 'Polls or receives push notification 60 minutes prior to scheduled client meetings.',
    details: {
      event: 'calendar.events.list (filter: status=confirmed, timeMin=now, timeMax=+2h)',
      payloadSnippet: `{
  "eventId": "cal_evt_99812",
  "summary": "Q4 Enterprise Renewal & SLA Architecture Review",
  "clientDomain": "apexhealth.org",
  "start": "2026-10-27T14:30:00Z",
  "attendees": ["e.reed@apexhealth.org", "m.zimmerman@apexhealth.org"]
}`,
      errorHandling: 'Retries with exponential backoff if calendar OAuth token requires refresh.',
    },
  },
  {
    id: 'node-context',
    title: 'Context & Email Aggregator',
    category: 'router',
    service: 'Gmail / Slack / CRM Hub',
    description: 'Retrieves last 3 email threads, open task commitments, and historical account notes.',
    details: {
      event: 'crm.accounts.get & gmail.messages.search (q: "from:apexhealth.org")',
      payloadSnippet: `{
  "clientAccount": "Apex Health Systems",
  "historicalOpenDeliverables": 2,
  "recentEmailsCount": 3,
  "accountARR": 320000
}`,
      errorHandling: 'Falls back to cached client dossier if CRM endpoint is slow.',
    },
  },
  {
    id: 'node-brief-ai',
    title: 'Pre-Meeting Brief Synthesizer',
    category: 'ai',
    service: 'Gemini 3.8 Flash (Server-Side)',
    description: 'Analyzes attendee sentiments, synthesizes email context, and compiles talking points.',
    details: {
      event: 'ai.models.generateContent (JSON Schema Mode)',
      payloadSnippet: `{
  "executiveSummary": "Apex Health is preparing for renewal...",
  "recommendedTalkingPoints": ["Acknowledge clinical feedback...", "Walk through failover logs..."]
}`,
      promptTemplate: `You are an elite chief of staff. Given upcoming meeting {title}, attendees {attendees}, and recent communications {emails}, generate an executive brief with objectives, stakeholder dossiers, and 4 high-impact talking points.`,
      errorHandling: 'Falls back to deterministic rule-based template if API rate limit exceeded.',
    },
  },
  {
    id: 'node-transcript-ingest',
    title: 'Post-Meeting Recording Webhook',
    category: 'trigger',
    service: 'Zoom / Meet / Teams / Otter',
    description: 'Fires webhook payload when meeting recording transcription finishes processing.',
    details: {
      event: 'recording.transcript_completed (HTTP POST)',
      payloadSnippet: `{
  "recordingId": "rec_0912384",
  "durationSeconds": 2740,
  "transcriptWordCount": 4820,
  "status": "ready"
}`,
      errorHandling: 'Validates HMAC SHA256 webhook signature before processing.',
    },
  },
  {
    id: 'node-action-ai',
    title: 'Structured Takeaway & Action Extractor',
    category: 'ai',
    service: 'Gemini 3.8 Flash (Server-Side)',
    description: 'Surgically isolates agreed decisions, deliverable descriptions, owners, and due dates.',
    details: {
      event: 'ai.models.generateContent (JSON Schema: actionItems[], keyDecisions[])',
      payloadSnippet: `{
  "keyDecisions": [{ "topic": "Renewal Pricing", "owner": "Sarah Lin" }],
  "actionItems": [{ "title": "Transmit signed BAA", "assignee": "Sarah Lin", "dueDate": "Today, 5PM" }]
}`,
      promptTemplate: `Analyze meeting transcript. Extract all explicit promises made by team members. Output valid JSON array with title, description, assignee, dueDate, priority, and confidence score.`,
      errorHandling: 'Zero hallucination guardrail: Flags any action item with confidence < 0.85 for manual review.',
    },
  },
  {
    id: 'node-human-gate',
    title: 'Human Confirmation Gate',
    category: 'gate',
    service: 'BriefTrack Staging Console',
    description: 'Safety gate holding extracted tasks until an operator reviews assignees and due dates.',
    details: {
      event: 'user.action.batch_confirm (User Verified in UI)',
      payloadSnippet: `{
  "batchId": "batch_771829",
  "verifiedBy": "sarah.lin@enterprise.io",
  "approvedCount": 4,
  "dismissedCount": 0
}`,
      errorHandling: 'Strict invariant: No external project management task can be created without this gate.',
    },
  },
  {
    id: 'node-task-router',
    title: 'Multi-Tool Project Dispatcher',
    category: 'router',
    service: 'Asana / Notion / ClickUp REST APIs',
    description: 'Constructs verified REST payloads and synchronizes tasks into connected client boards.',
    details: {
      event: 'POST /api/1.0/tasks OR POST /v1/pages',
      payloadSnippet: `{
  "destination": "asana",
  "taskId": "asana_task_120934001",
  "url": "https://app.asana.com/0/120934001/task"
}`,
      errorHandling: 'Automatic 3x retry on 429 rate limit with exponential backoff.',
    },
  },
  {
    id: 'node-cron-audit',
    title: 'Weekly Overdue Actions Cron',
    category: 'cron',
    service: 'Scheduled Cron Job (Every Monday 08:00)',
    description: 'Scans all active deliverables and compiles overdue slippage digest for team leads.',
    details: {
      event: 'cron: 0 8 * * 1 (Every Monday at 08:00 AM)',
      payloadSnippet: `{
  "auditedTasks": 48,
  "overdueCount": 3,
  "criticalCount": 2,
  "escalationDigestSent": true
}`,
      errorHandling: 'Logs audit report to long-term compliance storage.',
    },
  },
];

export const WorkflowBlueprint: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-action-ai');
  const [downloaded, setDownloaded] = useState(false);

  const activeNode = BLUEPRINT_NODES.find((n) => n.id === selectedNodeId) || BLUEPRINT_NODES[0];

  const handleDownloadN8n = () => {
    const n8nWorkflowJson = {
      name: 'BriefTrack AI - Meeting Prep & Action Automation',
      nodes: BLUEPRINT_NODES.map((node, idx) => ({
        id: node.id,
        name: node.title,
        type: node.category,
        position: [idx * 260, 200],
        parameters: {
          service: node.service,
          description: node.description,
          event: node.details.event,
        },
      })),
      connections: {
        'node-cal': { main: [[{ node: 'node-context', type: 'main', index: 0 }]] },
        'node-context': { main: [[{ node: 'node-brief-ai', type: 'main', index: 0 }]] },
        'node-transcript-ingest': { main: [[{ node: 'node-action-ai', type: 'main', index: 0 }]] },
        'node-action-ai': { main: [[{ node: 'node-human-gate', type: 'main', index: 0 }]] },
        'node-human-gate': { main: [[{ node: 'node-task-router', type: 'main', index: 0 }]] },
      },
      settings: {
        executionTimeout: 300,
        saveExecutionProgress: true,
      },
    };

    const blob = new Blob([JSON.stringify(n8nWorkflowJson, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brieftrack_n8n_workflow_blueprint.json';
    a.click();
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-blue-700 font-semibold mb-1">
            <GitBranch className="w-4 h-4 text-blue-600" />
            <span>Enterprise Integration Blueprint</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            n8n & Make.com Automation Architecture
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Interactive pipeline diagram mapping calendar webhooks, Gemini AI nodes, safety confirmation gates, and project management sync.
          </p>
        </div>

        <button
          onClick={handleDownloadN8n}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        >
          {downloaded ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Downloaded n8n JSON</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export n8n / Make Workflow Blueprint</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Pipeline Flow Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 overflow-x-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          End-to-End Execution Sequence (Click Any Node to Inspect Technical Contract)
        </div>

        <div className="flex items-center gap-3 min-w-[850px] py-4">
          {BLUEPRINT_NODES.slice(0, 5).map((node, idx) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all w-52 shrink-0 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>STEP 0{idx + 1}</span>
                    <span className="uppercase font-semibold text-blue-600">{node.category}</span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 leading-snug">{node.title}</div>
                  <div className="text-[11px] text-slate-500 truncate mt-1">{node.service}</div>
                </div>
                {idx < 4 && <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Phase 2: Post-Meeting & Gate */}
        <div className="flex items-center gap-3 min-w-[850px] py-2 border-t border-slate-100">
          <div className="text-[11px] font-mono text-slate-400 w-28 shrink-0">
            CONFIRMATION & SYNC:
          </div>
          {BLUEPRINT_NODES.slice(5).map((node, idx) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all w-56 shrink-0 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>GATE / DISPATCH</span>
                    <span className="uppercase font-semibold text-blue-600">{node.category}</span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 leading-snug">{node.title}</div>
                  <div className="text-[11px] text-slate-500 truncate mt-1">{node.service}</div>
                </div>
                {idx < 2 && <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Node Technical Inspection Drawer */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-mono uppercase text-blue-600 font-semibold tracking-wider">
              Selected Node Inspector · {activeNode.category.toUpperCase()}
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              {activeNode.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Connected Service: <strong className="text-slate-700">{activeNode.service}</strong>
            </p>
          </div>

          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded font-mono">
            {activeNode.id}
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          {activeNode.description}
        </p>

        {/* Technical Contract Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Trigger Event / Endpoint
            </label>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-800">
              {activeNode.details.event}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Resilience & Error Handling Policy
            </label>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700">
              {activeNode.details.errorHandling}
            </div>
          </div>
        </div>

        {activeNode.details.promptTemplate && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Gemini LLM System Prompt Template
            </label>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono whitespace-pre-wrap">
              {activeNode.details.promptTemplate}
            </pre>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Standard JSON Payload Contract
          </label>
          <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono max-h-48 overflow-y-auto">
            {activeNode.details.payloadSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
