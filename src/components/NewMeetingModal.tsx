import React, { useState } from 'react';
import { MeetingEvent } from '../types';
import { X, Calendar, Clock, Building2, Users } from 'lucide-react';

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeeting: (meeting: MeetingEvent) => void;
}

export const NewMeetingModal: React.FC<NewMeetingModalProps> = ({
  isOpen,
  onClose,
  onAddMeeting,
}) => {
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientDomain, setClientDomain] = useState('');
  const [scheduledDate, setScheduledDate] = useState('Tomorrow, 3:00 PM');
  const [dateISO, setDateISO] = useState('2026-10-29');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeRole, setAttendeeRole] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) return;

    const newMeeting: MeetingEvent = {
      id: `meet-${Date.now()}`,
      title: title.trim(),
      clientName: clientName.trim(),
      clientDomain: clientDomain.trim() || `${clientName.toLowerCase().replace(/\s+/g, '')}.com`,
      scheduledTime: '15:00',
      scheduledDate,
      dateISO,
      isPast: false,
      durationMinutes,
      location: 'Google Meet',
      briefStatus: 'pending',
      attendees: [
        {
          name: attendeeName.trim() || 'Senior Client Stakeholder',
          email: `${(attendeeName || 'client').toLowerCase().replace(/\s+/g, '.')}@client.com`,
          role: attendeeRole.trim() || 'VP of Technology',
          internal: false,
        },
        {
          name: 'Sarah Lin',
          email: 'sarah.lin@enterprise.io',
          role: 'Account Director',
          internal: true,
        },
      ],
    };

    onAddMeeting(newMeeting);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Schedule New Client Meeting
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Meeting Title / Topic</label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Platform Migration & Enterprise Security Review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Client Company</label>
              <input
                type="text"
                required
                placeholder="e.g. Horizon Therapeutics"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Client Domain</label>
              <input
                type="text"
                placeholder="e.g. horizonrx.com"
                value={clientDomain}
                onChange={(e) => setClientDomain(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Scheduled Date & Time</label>
              <input
                type="text"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-2 space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Lead Client Attendee
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Attendee Name"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Attendee Role / Title"
                  value={attendeeRole}
                  onChange={(e) => setAttendeeRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
            >
              Add to Calendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
