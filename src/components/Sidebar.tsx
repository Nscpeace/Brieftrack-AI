import React from 'react';
import {
  Calendar,
  FileText,
  Mic,
  CheckSquare,
  Layers,
  AlertTriangle,
  GitBranch,
  Building2,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  pendingActionsCount: number;
  overdueCount: number;
  upcomingCount: number;
  selectedClient: string;
  onSelectClient: (client: string) => void;
  clients: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  pendingActionsCount,
  overdueCount,
  upcomingCount,
  selectedClient,
  onSelectClient,
  clients,
}) => {
  const navItems = [
    {
      id: 'calendar',
      label: 'Calendar & Upcoming Calls',
      icon: Calendar,
      count: upcomingCount,
      countColor: 'text-slate-600',
    },
    {
      id: 'brief',
      label: 'Pre-Meeting Brief Dossier',
      icon: FileText,
    },
    {
      id: 'transcript',
      label: 'Transcript Processing Lab',
      icon: Mic,
    },
    {
      id: 'staging',
      label: 'Human Confirmation Gate',
      icon: CheckSquare,
      count: pendingActionsCount,
      countColor: pendingActionsCount > 0 ? 'text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold' : 'text-slate-400',
    },
    {
      id: 'tasks',
      label: 'Multi-Tool Task Sync',
      icon: Layers,
    },
    {
      id: 'overdue',
      label: 'Weekly Overdue Audit',
      icon: AlertTriangle,
      count: overdueCount,
      countColor: overdueCount > 0 ? 'text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-semibold' : 'text-slate-400',
    },
    {
      id: 'blueprint',
      label: 'Automation Blueprint (n8n/Make)',
      icon: GitBranch,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0 h-[calc(100vh-57px)] sticky top-[57px]">
      {/* Account / Client Context Switcher */}
      <div className="p-4 border-b border-slate-200">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          Client Workspace Context
        </label>
        <div className="relative">
          <select
            value={selectedClient}
            onChange={(e) => onSelectClient(e.target.value)}
            className="w-full text-xs font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer pr-7"
          >
            <option value="all">All Enterprise Accounts</option>
            {clients.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Building2 className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Primary Navigation Sections */}
      <div className="p-3 flex-1 overflow-y-auto space-y-1">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
          Operations Pipeline
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={`text-[11px] font-mono tabular-nums ${item.countColor || 'text-slate-500'}`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Status & Accuracy Safeguard Policy Callout */}
      <div className="p-3.5 m-3 border border-slate-200 bg-slate-50 rounded-lg text-xs">
        <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Security Safeguard Active</span>
        </div>
        <p className="text-slate-600 leading-relaxed text-[11px]">
          Action items require explicit human confirmation before assignment to prevent hallucinated tasks from entering client backlogs.
        </p>
      </div>
    </aside>
  );
};
