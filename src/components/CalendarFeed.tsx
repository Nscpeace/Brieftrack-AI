import React, { useState } from 'react';
import { MeetingEvent } from '../types';
import {
  Calendar,
  Clock,
  Video,
  Users,
  FileCheck,
  Plus,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Search,
  CalendarRange,
  History,
  RotateCcw,
  CheckCircle2,
  Archive,
} from 'lucide-react';

interface CalendarFeedProps {
  meetings: MeetingEvent[];
  selectedMeetingId: string;
  onSelectMeeting: (meetingId: string) => void;
  onViewBrief: (meetingId: string) => void;
  onGenerateBrief: (meetingId: string) => void;
  onNewMeeting: () => void;
  isGeneratingBrief?: string | null;
}

export const CalendarFeed: React.FC<CalendarFeedProps> = ({
  meetings,
  selectedMeetingId,
  onSelectMeeting,
  onViewBrief,
  onGenerateBrief,
  onNewMeeting,
  isGeneratingBrief = null,
}) => {
  const [timeframe, setTimeframe] = useState<'all' | 'upcoming' | 'past' | 'custom'>('upcoming');
  const [subUpcoming, setSubUpcoming] = useState<'all' | 'today' | 'tomorrow'>('all');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts
  const upcomingCount = meetings.filter((m) => !m.isPast).length;
  const pastCount = meetings.filter((m) => m.isPast).length;

  const filteredMeetings = meetings.filter((m) => {
    // Timeframe filter
    if (timeframe === 'upcoming') {
      if (m.isPast) return false;
      if (subUpcoming === 'today' && !m.scheduledDate.toLowerCase().includes('today')) return false;
      if (subUpcoming === 'tomorrow' && !m.scheduledDate.toLowerCase().includes('tomorrow')) return false;
    } else if (timeframe === 'past') {
      if (!m.isPast) return false;
    } else if (timeframe === 'custom') {
      if (startDate && m.dateISO && m.dateISO < startDate) return false;
      if (endDate && m.dateISO && m.dateISO > endDate) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.clientName.toLowerCase().includes(q) ||
        m.attendees.some((a) => a.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Quick Date Range Presets
  const setQuickRange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setTimeframe('custom');
  };

  return (
    <div className="space-y-6">
      {/* View Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Client Meeting Schedule & Historical Records
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Detect upcoming scheduled calls for pre-meeting dossiers, or audit historical meeting archives and decisions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNewMeeting}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Client Meeting</span>
          </button>
        </div>
      </div>

      {/* Date & Timeframe Filter Toolbar */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-3.5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Primary Timeframe Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setTimeframe('upcoming')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                timeframe === 'upcoming'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Upcoming Calls</span>
              <span className="font-mono text-[11px] tabular-nums opacity-80">
                ({upcomingCount})
              </span>
            </button>

            <button
              onClick={() => setTimeframe('past')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                timeframe === 'past'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Past Records</span>
              <span className="font-mono text-[11px] tabular-nums opacity-80">
                ({pastCount})
              </span>
            </button>

            <button
              onClick={() => setTimeframe('custom')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                timeframe === 'custom'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Specific Date Range</span>
            </button>

            <button
              onClick={() => setTimeframe('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                timeframe === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({meetings.length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search title, client, attendee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Sub-Filters for Upcoming Mode */}
        {timeframe === 'upcoming' && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
              Quick Window:
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSubUpcoming('all')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  subUpcoming === 'all'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Upcoming
              </button>
              <button
                onClick={() => setSubUpcoming('today')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  subUpcoming === 'today'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today Only
              </button>
              <button
                onClick={() => setSubUpcoming('tomorrow')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  subUpcoming === 'tomorrow'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tomorrow
              </button>
            </div>
          </div>
        )}

        {/* Custom Date Range Picker Toolbar */}
        {timeframe === 'custom' && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <label className="text-slate-500 font-medium text-[11px] uppercase">
                  From:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 font-mono"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <label className="text-slate-500 font-medium text-[11px] uppercase">
                  To:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 font-mono"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-400 font-medium mr-1">Presets:</span>
              <button
                onClick={() => setQuickRange('2026-10-21', '2026-10-28')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Past 7 Days
              </button>
              <button
                onClick={() => setQuickRange('2026-10-01', '2026-10-31')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                October 2026
              </button>
              <button
                onClick={() => setQuickRange('2026-10-28', '2026-11-04')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Next 7 Days
              </button>
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="px-2 py-0.5 text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                title="Reset Date Range"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Meetings List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMeetings.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xl p-8">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-800">
              No meetings found for this date range or filter
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your date range or switch to 'All Meetings' to view all client sessions.
            </p>
            <button
              onClick={() => {
                setTimeframe('all');
                setSearchQuery('');
              }}
              className="mt-4 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredMeetings.map((meeting) => {
            const isSelected = meeting.id === selectedMeetingId;
            const isGenerating = isGeneratingBrief === meeting.id;
            const hasBrief = meeting.briefStatus === 'ready' && meeting.brief;
            const isPast = meeting.isPast;

            return (
              <div
                key={meeting.id}
                className={`bg-white border rounded-xl p-5 transition-all ${
                  isSelected
                    ? 'border-blue-400 ring-1 ring-blue-400 shadow-sm'
                    : isPast
                    ? 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Meeting Metadata */}
                  <div className="space-y-1.5">
                    {/* Unboxed Metadata Line with Timeframe Indicator */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {isPast ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          <Archive className="w-3 h-3 text-slate-500" />
                          Concluded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          <Clock className="w-3 h-3 text-blue-600" />
                          Upcoming
                        </span>
                      )}
                      <span className="font-semibold text-blue-700">{meeting.clientName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums text-slate-700 flex items-center gap-1">
                        {meeting.scheduledDate} ({meeting.durationMinutes} min)
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-600">{meeting.location || 'Video Call'}</span>
                    </div>

                    <h2 className="text-base font-semibold text-slate-900">
                      {meeting.title}
                    </h2>

                    {/* Attendees Scannable List */}
                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div className="flex flex-wrap items-center gap-1">
                        {meeting.attendees.map((att, idx) => (
                          <span key={idx} className={att.internal ? 'text-slate-500' : 'text-slate-800 font-medium'}>
                            {att.name}
                            {idx < meeting.attendees.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions & Status */}
                  <div className="flex items-center gap-3 shrink-0">
                    {hasBrief ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {isPast ? 'Archive Dossier Ready' : 'Briefing Ready'}
                        </span>
                        <button
                          onClick={() => {
                            onSelectMeeting(meeting.id);
                            onViewBrief(meeting.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          <span>{isPast ? 'Review Past Dossier' : 'Review Dossier'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          onSelectMeeting(meeting.id);
                          onGenerateBrief(meeting.id);
                        }}
                        disabled={isGenerating}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Compiling Brief...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Synthesize Brief</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
