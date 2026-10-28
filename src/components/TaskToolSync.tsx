import React, { useState } from 'react';
import { ExtractedActionItem, TaskToolType } from '../types';
import {
  Layers,
  Send,
  ExternalLink,
  Code2,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

interface TaskToolSyncProps {
  actions: ExtractedActionItem[];
  activeTool: TaskToolType;
  onChangeTool: (tool: TaskToolType) => void;
  onSyncTasks: (tool: TaskToolType, tasks: ExtractedActionItem[]) => Promise<any>;
  isSyncing?: boolean;
}

export const TaskToolSync: React.FC<TaskToolSyncProps> = ({
  actions,
  activeTool,
  onChangeTool,
  onSyncTasks,
  isSyncing = false,
}) => {
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [syncSuccessToast, setSyncSuccessToast] = useState<string | null>(null);

  const confirmedActions = actions.filter((a) => a.confirmed || a.status === 'synced');
  const pendingConfirmation = actions.filter((a) => !a.confirmed && a.status !== 'synced');

  const handleExecuteSync = async () => {
    const toSync = actions.filter((a) => a.confirmed && a.status !== 'synced');
    if (toSync.length === 0) return;

    try {
      const res = await onSyncTasks(activeTool, toSync);
      setSyncSuccessToast(`Successfully pushed ${toSync.length} items to ${activeTool.toUpperCase()}`);
      setTimeout(() => setSyncSuccessToast(null), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  // Generate real tool-specific JSON payload representation
  const samplePayload = {
    destination: activeTool,
    apiEndpoint:
      activeTool === 'asana'
        ? 'https://app.asana.com/api/1.0/tasks'
        : activeTool === 'notion'
        ? 'https://api.notion.com/v1/pages'
        : 'https://api.clickup.com/api/v2/list/{list_id}/task',
    headers: {
      Authorization: `Bearer ${activeTool.toUpperCase()}_SECRET_WORKSPACE_TOKEN`,
      'Content-Type': 'application/json',
      ...(activeTool === 'notion' ? { 'Notion-Version': '2022-06-28' } : {}),
    },
    tasks: confirmedActions.map((task) => {
      if (activeTool === 'asana') {
        return {
          workspace: '120934000',
          projects: ['120934001'],
          name: task.title,
          notes: task.description,
          due_on: '2026-10-31',
          assignee: task.assigneeEmail,
          custom_fields: {
            Client: task.clientName,
            Priority: task.priority.toUpperCase(),
            Source: 'BriefTrack AI Transcript Engine',
          },
        };
      } else if (activeTool === 'notion') {
        return {
          parent: { database_id: 'db_78a1bc2940' },
          properties: {
            Name: { title: [{ text: { content: task.title } }] },
            Client: { select: { name: task.clientName } },
            Assignee: { people: [{ email: task.assigneeEmail }] },
            'Due Date': { date: { start: '2026-10-31' } },
            Priority: { select: { name: task.priority.toUpperCase() } },
            Verified: { checkbox: true },
          },
        };
      } else {
        return {
          name: task.title,
          description: task.description,
          assignees: [task.assigneeEmail],
          priority: task.priority === 'high' ? 1 : task.priority === 'medium' ? 2 : 3,
          due_date: 1761916800000,
          custom_fields: [{ id: 'cf_client', value: task.clientName }],
        };
      }
    }),
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(samplePayload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Tool Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Project Management Tools Distribution
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch verified action items into connected Asana projects, Notion databases, or ClickUp spaces.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowPayloadModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Code2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Inspect API Payloads</span>
          </button>

          <button
            onClick={handleExecuteSync}
            disabled={isSyncing || actions.filter((a) => a.confirmed && a.status !== 'synced').length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synchronizing...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>
                  Push to {activeTool.toUpperCase()} (
                  {actions.filter((a) => a.confirmed && a.status !== 'synced').length})
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {syncSuccessToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{syncSuccessToast}</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-600">Status 200 OK</span>
        </div>
      )}

      {/* Multi-Tool Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
            Active Workspace Destination:
          </span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => onChangeTool('asana')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeTool === 'asana'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>Asana</span>
              <span className="text-[10px] opacity-80 font-mono">Board</span>
            </button>
            <button
              onClick={() => onChangeTool('notion')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeTool === 'notion'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>Notion</span>
              <span className="text-[10px] opacity-80 font-mono">Database</span>
            </button>
            <button
              onClick={() => onChangeTool('clickup')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeTool === 'clickup'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>ClickUp</span>
              <span className="text-[10px] opacity-80 font-mono">Sprint</span>
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Connected: {confirmedActions.length} tracked items
        </div>
      </div>

      {/* Tool-Specific Native Previews */}

      {/* 1. ASANA BOARD / LIST VIEW */}
      {activeTool === 'asana' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold">
                A
              </div>
              <span className="text-sm font-bold text-slate-900">
                Asana Workspace · Client Engagements / Deliverables Backlog
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">API v1.0 Live Mock</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Client Review */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider px-1">
                <span>To Do / Scoping</span>
                <span className="font-mono tabular-nums text-slate-400">
                  {confirmedActions.filter((a) => a.priority === 'low' || !a.syncedTo).length}
                </span>
              </div>
              {confirmedActions
                .filter((a) => a.priority === 'low' || !a.syncedTo)
                .map((act) => (
                  <div key={act.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-2 text-xs">
                    <div className="font-semibold text-slate-900 leading-snug">{act.title}</div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{act.assignee}</span>
                      <span className="font-mono tabular-nums">{act.dueDate}</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Column 2: In Progress */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider px-1">
                <span>In Progress</span>
                <span className="font-mono tabular-nums text-slate-400">
                  {confirmedActions.filter((a) => a.priority === 'medium' && a.syncedTo).length}
                </span>
              </div>
              {confirmedActions
                .filter((a) => a.priority === 'medium' && a.syncedTo)
                .map((act) => (
                  <div key={act.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-2 text-xs">
                    <div className="font-semibold text-slate-900 leading-snug">{act.title}</div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{act.assignee}</span>
                      <span className="font-mono tabular-nums">{act.dueDate}</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Column 3: High Priority / Ready for Review */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider px-1">
                <span>High Priority / Critical</span>
                <span className="font-mono tabular-nums text-slate-400">
                  {confirmedActions.filter((a) => a.priority === 'high').length}
                </span>
              </div>
              {confirmedActions
                .filter((a) => a.priority === 'high')
                .map((act) => (
                  <div key={act.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-2 text-xs">
                    <div className="font-semibold text-slate-900 leading-snug">{act.title}</div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{act.assignee}</span>
                      <span className="font-mono tabular-nums text-rose-600 font-medium">{act.dueDate}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. NOTION DATABASE GRID VIEW */}
      {activeTool === 'notion' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold">
                N
              </div>
              <span className="font-bold text-slate-900">
                Notion Database · Client Engagements / Action Tracker
              </span>
            </div>
            <span className="text-slate-500 font-mono text-[11px]">Database Schema v2022-06-28</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-[11px] font-semibold text-slate-500">
                  <th className="py-2.5 px-4">Name</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Assignee</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-4 text-right">Notion Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {confirmedActions.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {act.title}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{act.clientName}</td>
                    <td className="py-3 px-3 text-slate-700">{act.assignee}</td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-600 text-[11px]">
                      {act.dueDate}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-medium bg-slate-100 text-slate-700">
                        {act.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] text-emerald-700 font-medium">
                        {act.status === 'synced' ? 'Synced' : 'Verified'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {act.externalUrl ? (
                        <a
                          href={act.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">Pending Push</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CLICKUP SPRINT LIST VIEW */}
      {activeTool === 'clickup' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                CU
              </div>
              <span className="text-sm font-bold text-slate-900">
                ClickUp Space · Operations / Client Steering Committee Tasks
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">v2 REST API</span>
          </div>

          <div className="space-y-2">
            {confirmedActions.map((act) => (
              <div
                key={act.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span className="font-semibold text-slate-900">{act.title}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] pl-4">{act.description}</p>
                </div>

                <div className="flex items-center gap-4 text-slate-600 text-[11px] shrink-0 pl-4 sm:pl-0">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {act.assignee}
                  </span>
                  <span className="font-mono tabular-nums flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {act.dueDate}
                  </span>
                  <span className="font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-semibold uppercase text-[10px]">
                    {act.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JSON Payload Inspection Modal */}
      {showPayloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Synchronized REST API Payload ({activeTool.toUpperCase()})
                </h3>
              </div>
              <button
                onClick={() => setShowPayloadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              This exact payload schema is constructed by the n8n / Make integration node and transmitted to the external task provider API.
            </p>

            <div className="relative">
              <button
                onClick={handleCopyPayload}
                className="absolute right-3 top-3 p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded text-xs flex items-center gap-1"
              >
                {copiedPayload ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>

              <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono max-h-96 overflow-y-auto">
                {JSON.stringify(samplePayload, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPayloadModal(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
