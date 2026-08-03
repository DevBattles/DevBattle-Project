import React from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';

export const CalendarView: React.FC = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  const events: Record<number, { title: string; type: 'homework' | 'contest'; time: string }[]> = {
    5: [{ title: 'DevBattles Sprint #42', type: 'contest', time: '18:00 UTC' }],
    8: [{ title: 'Maps & Two Pointers Homework', type: 'homework', time: '23:59 UTC' }],
    12: [{ title: 'Kanban Mastery Challenge', type: 'homework', time: '23:59 UTC' }],
    18: [{ title: 'Global DSA Championship', type: 'contest', time: '14:00 UTC' }],
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-slate-100 light:text-slate-900">August 2026</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 light:bg-slate-100 light:border-slate-200">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 light:bg-slate-100 light:border-slate-200">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
        {days.map((d) => (
          <div key={d} className="py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dates.map((d) => {
          const hasEvent = events[d];
          const isToday = d === 3;
          return (
            <div
              key={d}
              className={`min-h-[70px] p-2 rounded-xl border transition-all flex flex-col justify-between text-left ${
                isToday
                  ? 'border-indigo-500 bg-indigo-950/30 font-bold text-indigo-400'
                  : 'border-slate-800/80 bg-slate-950/40 hover:bg-slate-800/30 text-slate-300 light:border-slate-200 light:bg-slate-50'
              }`}
            >
              <span className="text-xs font-semibold">{d}</span>
              {hasEvent && (
                <div className="space-y-1 mt-1">
                  {hasEvent.map((evt, idx) => (
                    <div
                      key={idx}
                      className={`text-[10px] p-1 rounded font-medium truncate ${
                        evt.type === 'contest'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                      title={`${evt.title} (${evt.time})`}
                    >
                      {evt.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
