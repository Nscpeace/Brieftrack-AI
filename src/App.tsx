import React, { useState } from 'react';
import {
  MeetingEvent,
  ExtractedActionItem,
  OverdueTask,
  TaskToolType,
  DecisionLogItem,
} from './types';
import {
  INITIAL_MEETINGS,
  INITIAL_ACTIONS,
  INITIAL_OVERDUE,
} from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CalendarFeed } from './components/CalendarFeed';
import { BriefViewer } from './components/BriefViewer';
import { TranscriptLab } from './components/TranscriptLab';
import { ActionStaging } from './components/ActionStaging';
import { TaskToolSync } from './components/TaskToolSync';
import { OverdueReport } from './components/OverdueReport';
import { WorkflowBlueprint } from './components/WorkflowBlueprint';
import { NewMeetingModal } from './components/NewMeetingModal';

export default function App() {
  const [meetings, setMeetings] = useState<MeetingEvent[]>(INITIAL_MEETINGS);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(INITIAL_MEETINGS[0].id);
  const [actions, setActions] = useState<ExtractedActionItem[]>(INITIAL_ACTIONS);
  const [overdueTasks, setOverdueTasks] = useState<OverdueTask[]>(INITIAL_OVERDUE);
  const [activeView, setActiveView] = useState<string>('calendar');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [activeTool, setActiveTool] = useState<TaskToolType>('asana');

  // Loading & Modal states
  const [isGeneratingBrief, setIsGeneratingBrief] = useState<string | null>(null);
  const [isProcessingTranscript, setIsProcessingTranscript] = useState(false);
  const [isSyncingTasks, setIsSyncingTasks] = useState(false);
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);

  // Extract unique client accounts for workspace filter
  const clients = Array.from(new Set(meetings.map((m) => m.clientName)));

  // Filter meetings by selected client account
  const visibleMeetings = selectedClient === 'all'
    ? meetings
    : meetings.filter((m) => m.clientName === selectedClient);

  // Filter actions by selected client account
  const visibleActions = selectedClient === 'all'
    ? actions
    : actions.filter((a) => a.clientName === selectedClient);

  // Metrics
  const pendingActionsCount = actions.filter(
    (a) => !a.confirmed && a.status !== 'synced' && a.status !== 'rejected'
  ).length;
  const overdueCount = overdueTasks.length;
  const upcomingCount = meetings.filter((m) => !m.isPast).length;

  // Pre-Meeting Brief Generation
  const handleGenerateBrief = async (meetingId: string) => {
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting) return;

    setIsGeneratingBrief(meetingId);
    try {
      const response = await fetch('/api/briefs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingTitle: meeting.title,
          clientName: meeting.clientName,
          scheduledTime: meeting.scheduledDate,
          durationMinutes: meeting.durationMinutes,
          attendees: meeting.attendees,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setMeetings((prev) =>
        prev.map((m) =>
          m.id === meetingId
            ? { ...m, briefStatus: 'ready', brief: data.brief }
            : m
        )
      );
    } catch (err) {
      console.error('Failed to generate brief:', err);
    } finally {
      setIsGeneratingBrief(null);
    }
  };

  // Post-Meeting Transcript Processing
  const handleProcessTranscript = async (
    transcript: string,
    meetingTitle: string,
    clientName: string
  ): Promise<{
    summary: string;
    sentiment: string;
    keyDecisions: DecisionLogItem[];
    actionItems: ExtractedActionItem[];
  }> => {
    setIsProcessingTranscript(true);
    try {
      const meeting = meetings.find((m) => m.title === meetingTitle || m.clientName === clientName);

      const response = await fetch('/api/transcripts/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          meetingTitle,
          clientName,
          attendees: meeting?.attendees || [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const result = data.result;

      // Ensure actions have required fields
      const formattedActions: ExtractedActionItem[] = (result.actionItems || []).map(
        (act: any, idx: number) => ({
          id: act.id || `act-${Date.now()}-${idx}`,
          meetingId: meeting?.id || 'meet-custom',
          clientName: clientName || 'Client Account',
          title: act.title,
          description: act.description || '',
          assignee: act.assignee || 'Sarah Lin',
          assigneeEmail: act.assigneeEmail || 'sarah.lin@enterprise.io',
          dueDate: act.dueDate || 'Friday, Nov 7',
          priority: (act.priority || 'medium').toLowerCase() as any,
          confirmed: false,
          status: 'pending_review',
          confidence: act.confidence || 0.95,
        })
      );

      return {
        summary: result.summary,
        sentiment: result.sentiment || 'Constructive & Aligned',
        keyDecisions: result.keyDecisions || [],
        actionItems: formattedActions,
      };
    } finally {
      setIsProcessingTranscript(false);
    }
  };

  // Transfer newly extracted actions to Confirmation Gate
  const handleSendToStaging = (newActions: ExtractedActionItem[]) => {
    setActions((prev) => [...newActions, ...prev]);
    setActiveView('staging');
  };

  // Human Confirmation Actions
  const handleConfirmAction = (id: string) => {
    setActions((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, confirmed: true, status: 'confirmed' } : a
      )
    );
  };

  const handleRejectAction = (id: string) => {
    setActions((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'rejected' } : a
      )
    );
  };

  const handleUpdateAction = (id: string, delta: Partial<ExtractedActionItem>) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...delta } : a))
    );
  };

  const handleBatchConfirm = (ids: string[]) => {
    setActions((prev) =>
      prev.map((a) =>
        ids.includes(a.id) ? { ...a, confirmed: true, status: 'confirmed' } : a
      )
    );
  };

  // Push Confirmed to Task Tools
  const handleSyncTasks = async (tool: TaskToolType, tasksToSync: ExtractedActionItem[]) => {
    setIsSyncingTasks(true);
    try {
      const response = await fetch('/api/tasks/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool,
          tasks: tasksToSync,
        }),
      });

      if (!response.ok) {
        throw new Error('Sync failed');
      }

      const data = await response.json();
      const syncedMap = new Map(data.syncedTasks.map((t: any) => [t.id, t]));

      setActions((prev) =>
        prev.map((a) => (syncedMap.has(a.id) ? { ...a, ...(syncedMap.get(a.id) as any) } : a))
      );

      return data;
    } finally {
      setIsSyncingTasks(false);
    }
  };

  // Overdue Task Management
  const handleResolveOverdue = (id: string) => {
    setOverdueTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Add New Meeting
  const handleAddMeeting = (newMeeting: MeetingEvent) => {
    setMeetings((prev) => [newMeeting, ...prev]);
    setSelectedMeetingId(newMeeting.id);
    handleGenerateBrief(newMeeting.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Bar Navigation */}
      <Header
        activeView={activeView}
        onNavigate={setActiveView}
        onQuickProcess={() => setActiveView('transcript')}
        isProcessing={isProcessingTranscript}
        meetings={meetings}
        actions={actions}
        onSelectMeeting={(id) => {
          setSelectedMeetingId(id);
          setActiveView('brief');
        }}
        onSelectAction={() => {
          setActiveView('staging');
        }}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Workspace Sidebar */}
        <Sidebar
          activeView={activeView}
          onNavigate={setActiveView}
          pendingActionsCount={pendingActionsCount}
          overdueCount={overdueCount}
          upcomingCount={upcomingCount}
          selectedClient={selectedClient}
          onSelectClient={setSelectedClient}
          clients={clients}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {activeView === 'calendar' && (
            <CalendarFeed
              meetings={visibleMeetings}
              selectedMeetingId={selectedMeetingId}
              onSelectMeeting={setSelectedMeetingId}
              onViewBrief={(id) => {
                setSelectedMeetingId(id);
                setActiveView('brief');
              }}
              onGenerateBrief={handleGenerateBrief}
              onNewMeeting={() => setIsNewMeetingModalOpen(true)}
              isGeneratingBrief={isGeneratingBrief}
            />
          )}

          {activeView === 'brief' && (
            <BriefViewer
              meetings={visibleMeetings}
              selectedMeetingId={selectedMeetingId}
              onSelectMeeting={setSelectedMeetingId}
              onRegenerateBrief={handleGenerateBrief}
              onNavigateToTranscript={(id) => {
                setSelectedMeetingId(id);
                setActiveView('transcript');
              }}
              isRegenerating={isGeneratingBrief === selectedMeetingId}
            />
          )}

          {activeView === 'transcript' && (
            <TranscriptLab
              onProcessTranscript={handleProcessTranscript}
              onSendToStaging={handleSendToStaging}
              isProcessing={isProcessingTranscript}
            />
          )}

          {activeView === 'staging' && (
            <ActionStaging
              actions={visibleActions}
              onConfirmAction={handleConfirmAction}
              onRejectAction={handleRejectAction}
              onUpdateAction={handleUpdateAction}
              onBatchConfirm={handleBatchConfirm}
              onPushToTaskTool={() => setActiveView('tasks')}
              onAddManualAction={(newAct) => {
                const act: ExtractedActionItem = {
                  ...newAct,
                  id: `act-manual-${Date.now()}`,
                };
                setActions((prev) => [act, ...prev]);
              }}
            />
          )}

          {activeView === 'tasks' && (
            <TaskToolSync
              actions={visibleActions}
              activeTool={activeTool}
              onChangeTool={setActiveTool}
              onSyncTasks={handleSyncTasks}
              isSyncing={isSyncingTasks}
            />
          )}

          {activeView === 'overdue' && (
            <OverdueReport
              tasks={overdueTasks}
              onResolveTask={handleResolveOverdue}
            />
          )}

          {activeView === 'blueprint' && <WorkflowBlueprint />}
        </main>
      </div>

      {/* New Meeting Modal */}
      <NewMeetingModal
        isOpen={isNewMeetingModalOpen}
        onClose={() => setIsNewMeetingModalOpen(false)}
        onAddMeeting={handleAddMeeting}
      />
    </div>
  );
}
