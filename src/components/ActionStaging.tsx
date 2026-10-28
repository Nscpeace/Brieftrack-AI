import React, { useState } from 'react';
import { ExtractedActionItem } from '../types';
import {
  CheckSquare,
  ShieldCheck,
  Check,
  X,
  Edit2,
  Trash2,
  Plus,
  Send,
  Calendar,
  User,
  AlertCircle,
  Filter,
} from 'lucide-react';

export const PriorityBadge: React.FC<{ priority: 'high' | 'medium' | 'low'; className?: string }> = ({
  priority,
  className = '',
}) => {
  const normalized = (priority || 'medium').toLowerCase();

  if (normalized === 'high') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 shadow-2xs ${className}`}
        title="High Priority"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        High
      </span>
    );
  }

  if (normalized === 'medium') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 shadow-2xs ${className}`}
        title="Medium Priority"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        Medium
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 shadow-2xs ${className}`}
      title="Low Priority"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      Low
    </span>
  );
};

interface ActionStagingProps {
  actions: ExtractedActionItem[];
  onConfirmAction: (actionId: string) => void;
  onRejectAction: (actionId: string) => void;
  onUpdateAction: (actionId: string, updated: Partial<ExtractedActionItem>) => void;
  onBatchConfirm: (actionIds: string[]) => void;
  onPushToTaskTool: () => void;
  onAddManualAction: (action: Omit<ExtractedActionItem, 'id'>) => void;
}

export const ActionStaging: React.FC<ActionStagingProps> = ({
  actions,
  onConfirmAction,
  onRejectAction,
  onUpdateAction,
  onBatchConfirm,
  onPushToTaskTool,
  onAddManualAction,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'synced'>('pending');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New action form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssignee, setNewAssignee] = useState('Sarah Lin');
  const [newDueDate, setNewDueDate] = useState('Friday, Nov 7');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newClient, setNewClient] = useState('Apex Health Systems');

  const filteredActions = actions.filter((act) => {
    if (filter === 'pending' && (act.confirmed || act.status === 'synced' || act.status === 'rejected')) return false;
    if (filter === 'confirmed' && (!act.confirmed || act.status === 'synced')) return false;
    if (filter === 'synced' && act.status !== 'synced') return false;
    if (priorityFilter !== 'all' && (act.priority || 'medium').toLowerCase() !== priorityFilter) return false;
    return true;
  });

  const pendingCount = actions.filter((a) => !a.confirmed && a.status !== 'synced' && a.status !== 'rejected').length;
  const confirmedCount = actions.filter((a) => a.confirmed && a.status !== 'synced').length;
  const syncedCount = actions.filter((a) => a.status === 'synced').length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredActions.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchConfirmClick = () => {
    onBatchConfirm(selectedIds);
    setSelectedIds([]);
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddManualAction({
      meetingId: 'custom-manual',
      clientName: newClient,
      title: newTitle.trim(),
      description: newDesc.trim(),
      assignee: newAssignee,
      assigneeEmail: `${newAssignee.toLowerCase().replace(' ', '.')}@enterprise.io`,
      dueDate: newDueDate,
      priority: newPriority,
      confirmed: true,
      status: 'confirmed',
      confidence: 1.0,
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-blue-700 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Human-in-the-Loop Accuracy Safeguard</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Action Items Confirmation Gate
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review, calibrate, and verify AI-extracted deliverables before pushing them into Asana, Notion, or ClickUp.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Manual Action</span>
          </button>

          <button
            onClick={onPushToTaskTool}
            disabled={confirmedCount === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Sync Confirmed to Project Tools ({confirmedCount})</span>
          </button>
        </div>
      </div>

      {/* Filter and Metrics Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-xl">
        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === 'pending' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Awaiting Confirmation ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === 'confirmed' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ready to Push ({confirmedCount})
            </button>
            <button
              onClick={() => setFilter('synced')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === 'synced' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Synced Live ({syncedCount})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({actions.length})
            </button>
          </div>

          {/* Priority Quick Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1.5">Priority:</span>
            <button
              onClick={() => setPriorityFilter('all')}
              className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                priorityFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setPriorityFilter('high')}
              className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
                priorityFilter === 'high' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              High
            </button>
            <button
              onClick={() => setPriorityFilter('medium')}
              className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
                priorityFilter === 'medium' ? 'bg-amber-600 text-white shadow-2xs' : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setPriorityFilter('low')}
              className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                priorityFilter === 'low' ? 'bg-slate-700 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Low
            </button>
          </div>
        </div>

        {/* Batch selection toolbar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-mono">
              {selectedIds.length} selected
            </span>
            <button
              onClick={handleBatchConfirmClick}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            >
              Confirm Selected
            </button>
            <button
              onClick={() => {
                selectedIds.forEach((id) => onRejectAction(id));
                setSelectedIds([]);
              }}
              className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Actions Table / List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {filteredActions.length === 0 ? (
          <div className="text-center py-12 p-8">
            <CheckSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">No action items in this view</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Process a meeting transcript in the Transcript Lab to extract candidate actions.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {/* Table Header Row */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={selectedIds.length === filteredActions.length && filteredActions.length > 0}
                onChange={handleSelectAll}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="flex-1">Deliverable & Scope</span>
              <span className="w-28 hidden sm:block">Priority</span>
              <span className="w-32 hidden md:block">Assignee</span>
              <span className="w-28 hidden lg:block">Due Date</span>
              <span className="w-28 text-right">Verification</span>
            </div>

            {/* Rows */}
            {filteredActions.map((act) => {
              const isSelected = selectedIds.includes(act.id);
              const isEditing = editingId === act.id;

              return (
                <div
                  key={act.id}
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 transition-colors ${
                    isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Select Checkbox */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(act.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 min-w-0 space-y-1">
                    {isEditing ? (
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={act.title}
                          onChange={(e) => onUpdateAction(act.id, { title: e.target.value })}
                          className="w-full text-xs font-semibold bg-white border border-blue-400 rounded px-2 py-1 text-slate-900"
                        />
                        <textarea
                          rows={2}
                          value={act.description}
                          onChange={(e) => onUpdateAction(act.id, { description: e.target.value })}
                          className="w-full text-xs bg-white border border-slate-300 rounded p-1.5 text-slate-700"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 leading-snug">
                            {act.title}
                          </span>
                          <span className="text-[10px] text-blue-700 font-medium">
                            {act.clientName}
                          </span>
                          {/* Mobile Priority Badge */}
                          <span className="sm:hidden">
                            <PriorityBadge priority={act.priority} />
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1">
                          {act.description}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Priority Column with Color-Coded Badge */}
                  <div className="w-28 shrink-0 text-xs hidden sm:block">
                    {isEditing ? (
                      <select
                        value={act.priority}
                        onChange={(e) => onUpdateAction(act.id, { priority: e.target.value as any })}
                        className="w-full text-xs bg-white border border-slate-300 rounded px-1.5 py-1 font-semibold"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    ) : (
                      <PriorityBadge priority={act.priority} />
                    )}
                  </div>

                  {/* Assignee */}
                  <div className="w-32 shrink-0 text-xs">
                    {isEditing ? (
                      <select
                        value={act.assignee}
                        onChange={(e) => onUpdateAction(act.id, { assignee: e.target.value })}
                        className="w-full text-xs bg-white border border-slate-300 rounded px-1.5 py-1"
                      >
                        <option value="Sarah Lin">Sarah Lin</option>
                        <option value="Alex Rivera">Alex Rivera</option>
                        <option value="David Chen">David Chen</option>
                        <option value="Marcus Vance">Marcus Vance</option>
                      </select>
                    ) : (
                      <div className="text-slate-800 font-medium truncate flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{act.assignee}</span>
                      </div>
                    )}
                  </div>

                  {/* Due Date */}
                  <div className="w-28 shrink-0 text-xs">
                    {isEditing ? (
                      <input
                        type="text"
                        value={act.dueDate}
                        onChange={(e) => onUpdateAction(act.id, { dueDate: e.target.value })}
                        className="w-full text-xs bg-white border border-slate-300 rounded px-1.5 py-1 font-mono"
                      />
                    ) : (
                      <span className="text-slate-600 font-mono tabular-nums text-[11px] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        {act.dueDate}
                      </span>
                    )}
                  </div>

                  {/* Verification Status & Quick Inline Actions */}
                  <div className="w-28 shrink-0 flex items-center justify-end gap-1.5">
                    {isEditing ? (
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        title="Save Changes"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingId(act.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded"
                        title="Edit Task Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {act.status === 'synced' ? (
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Synced
                      </span>
                    ) : act.confirmed ? (
                      <span className="text-[11px] text-blue-700 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3 text-blue-600" />
                        Confirmed
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onConfirmAction(act.id)}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                          title="Confirm Deliverable"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => onRejectAction(act.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Dismiss / Reject"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Action Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Manual Action Item</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManual} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Client Account</label>
                <input
                  type="text"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Deliverable Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Circulate revised architectural schema diagram"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Deliverable Specification</label>
                <textarea
                  rows={2}
                  placeholder="Specific deliverables, parameters, or success criteria..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Owner / Assignee</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5"
                  >
                    <option value="Sarah Lin">Sarah Lin</option>
                    <option value="Alex Rivera">Alex Rivera</option>
                    <option value="David Chen">David Chen</option>
                    <option value="Marcus Vance">Marcus Vance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Target Due Date</label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Add Action Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
