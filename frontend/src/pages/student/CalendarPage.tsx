import React from 'react';
import { CalendarView } from '../../components/ui/CalendarView';

export const CalendarPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-slate-100">Productivity & Event Calendar</h1>
        <p className="text-xs text-slate-400">Track homework deadlines, live coding contests, and study goals.</p>
      </div>

      <CalendarView />
    </div>
  );
};
