export interface Attendee {
  name: string;
  email: string;
  role: string;
  internal: boolean;
}

export interface MeetingBrief {
  meetingId: string;
  executiveSummary: string;
  keyObjective: string;
  attendeeDossier: Array<{
    name: string;
    notes: string;
    recentSentiment: 'positive' | 'neutral' | 'guarded' | 'supportive';
  }>;
  recentInteractions: Array<{
    date: string;
    channel: 'Email' | 'Slack' | 'Call';
    summary: string;
  }>;
  openHistoricalActions: Array<{
    title: string;
    assignee: string;
    dueDate: string;
    status: 'in-progress' | 'blocked' | 'pending';
  }>;
  keyMetrics: Array<{
    label: string;
    value: string;
    trend?: string;
  }>;
  recommendedTalkingPoints: string[];
}

export interface MeetingEvent {
  id: string;
  title: string;
  clientName: string;
  clientDomain: string;
  scheduledTime: string;
  scheduledDate: string; // e.g. "Today, 2:30 PM"
  dateISO?: string; // e.g. "2026-10-28" for date-range filtering
  isPast?: boolean; // true for historical/past meetings
  durationMinutes: number;
  attendees: Attendee[];
  briefStatus: 'ready' | 'generating' | 'pending';
  brief?: MeetingBrief;
  transcriptPresetId?: string;
  location?: string;
}

export interface ExtractedActionItem {
  id: string;
  meetingId: string;
  clientName: string;
  title: string;
  description: string;
  assignee: string;
  assigneeEmail: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  confirmed: boolean;
  status: 'pending_review' | 'confirmed' | 'synced' | 'rejected';
  syncedTo?: 'asana' | 'notion' | 'clickup';
  externalId?: string;
  externalUrl?: string;
  confidence?: number;
}

export interface DecisionLogItem {
  id: string;
  topic: string;
  decision: string;
  rationale: string;
  owner: string;
}

export interface TranscriptPreset {
  id: string;
  title: string;
  clientName: string;
  meetingType: string;
  snippet: string;
  fullTranscript: string;
}

export interface OverdueTask {
  id: string;
  clientName: string;
  title: string;
  assignee: string;
  assigneeEmail: string;
  dueDate: string;
  daysOverdue: number;
  priority: 'high' | 'medium' | 'low';
  lastUpdate: string;
  riskTier: string;
}

export type TaskToolType = 'asana' | 'notion' | 'clickup';
