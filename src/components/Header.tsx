import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Sparkles,
  Search,
  X,
  Calendar,
  CheckSquare,
  Clock,
  User,
  ArrowRight,
} from 'lucide-react';
import { MeetingEvent, ExtractedActionItem } from '../types';

interface HeaderProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onQuickProcess: () => void;
  isProcessing?: boolean;
  meetings?: MeetingEvent[];
  actions?: ExtractedActionItem[];
  onSelectMeeting?: (meetingId: string) => void;
  onSelectAction?: (actionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  onQuickProcess,
  isProcessing = false,
  meetings = [],
  actions = [],
  onSelectMeeting,
  onSelectAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard shortcut (Cmd+K or Ctrl+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter meetings and actions
  const query = searchQuery.trim().toLowerCase();
  const matchingMeetings = query
    ? meetings.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.clientName.toLowerCase().includes(query)
      )
    : [];

  const matchingActions = query
    ? actions.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.clientName.toLowerCase().includes(query)
      )
    : [];

  const totalResults = matchingMeetings.length + matchingActions.length;

  const handleMeetingClick = (meetingId: string) => {
    if (onSelectMeeting) {
      onSelectMeeting(meetingId);
    }
    onNavigate('brief');
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleActionClick = (actionId: string) => {
    if (onSelectAction) {
      onSelectAction(actionId);
    }
    onNavigate('staging');
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="flex items-center justify-between gap-4 md:gap-6 px-4 md:px-6 py-3 bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('calendar');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap hover:text-blue-600 transition-colors"
        >
          BriefTrack AI
        </a>
        <span className="text-[11px] text-slate-400 font-mono hidden xl:inline">
          v2.4
        </span>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden 2xl:flex items-center gap-6 text-xs font-medium text-slate-600 shrink-0">
        <button
          onClick={() => onNavigate('calendar')}
          className={`whitespace-nowrap transition-colors pb-0.5 ${
            activeView === 'calendar'
              ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
              : 'hover:text-slate-900'
          }`}
        >
          Calendar Sync
        </button>
        <button
          onClick={() => onNavigate('brief')}
          className={`whitespace-nowrap transition-colors pb-0.5 ${
            activeView === 'brief'
              ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
              : 'hover:text-slate-900'
          }`}
        >
          Meeting Briefs
        </button>
        <button
          onClick={() => onNavigate('transcript')}
          className={`whitespace-nowrap transition-colors pb-0.5 ${
            activeView === 'transcript'
              ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
              : 'hover:text-slate-900'
          }`}
        >
          Transcript Lab
        </button>
        <button
          onClick={() => onNavigate('staging')}
          className={`whitespace-nowrap transition-colors pb-0.5 ${
            activeView === 'staging'
              ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
              : 'hover:text-slate-900'
          }`}
        >
          Action Confirmation
        </button>
        <button
          onClick={() => onNavigate('tasks')}
          className={`whitespace-nowrap transition-colors pb-0.5 ${
            activeView === 'tasks'
              ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
              : 'hover:text-slate-900'
          }`}
        >
          Project Tools Sync
        </button>
      </nav>

      {/* Zone 2B: Search Bar with Autocomplete Dropdown */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-md mx-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (searchQuery.trim()) {
                setIsOpen(true);
              }
            }}
            placeholder="Search meetings or actions by title, client..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-16 py-1.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <div className="absolute right-2 top-1.5 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsOpen(false);
                }}
                className="p-0.5 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* Live Search Results Dropdown */}
        {isOpen && searchQuery.trim() && (
          <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto divide-y divide-slate-100">
            {totalResults === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No meetings or actions match <strong className="text-slate-700">"{searchQuery}"</strong>
              </div>
            ) : (
              <>
                {/* Meetings Group */}
                {matchingMeetings.length > 0 && (
                  <div className="p-2">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-blue-600" />
                        Upcoming Meetings
                      </span>
                      <span className="font-mono">{matchingMeetings.length}</span>
                    </div>
                    <div className="space-y-0.5">
                      {matchingMeetings.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => handleMeetingClick(m.id)}
                          className="w-full p-2 text-left hover:bg-slate-50 rounded-lg transition-colors flex items-start justify-between gap-2 group"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {m.title}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span className="font-medium text-slate-700">{m.clientName}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums">{m.scheduledDate}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 shrink-0">
                            Brief
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions Group */}
                {matchingActions.length > 0 && (
                  <div className="p-2">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <CheckSquare className="w-3 h-3 text-emerald-600" />
                        Tracked Actions
                      </span>
                      <span className="font-mono">{matchingActions.length}</span>
                    </div>
                    <div className="space-y-0.5">
                      {matchingActions.map((act) => (
                        <button
                          key={act.id}
                          onClick={() => handleActionClick(act.id)}
                          className="w-full p-2 text-left hover:bg-slate-50 rounded-lg transition-colors flex items-start justify-between gap-2 group"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {act.title}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span className="font-medium text-slate-700">{act.clientName}</span>
                              <span aria-hidden="true">·</span>
                              <span>{act.assignee}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums">Due {act.dueDate}</span>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 uppercase ${
                              act.status === 'synced'
                                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                                : act.confirmed
                                ? 'bg-blue-50 text-blue-700 font-semibold'
                                : 'bg-amber-50 text-amber-700 font-semibold'
                            }`}
                          >
                            {act.status === 'synced' ? 'Synced' : act.confirmed ? 'Confirmed' : 'Pending'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Zone 3: Primary Action CTA */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onQuickProcess}
          disabled={isProcessing}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap shadow-sm"
        >
          {isProcessing ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Synthesizing...</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" />
              <span className="hidden sm:inline">Process Transcript</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
