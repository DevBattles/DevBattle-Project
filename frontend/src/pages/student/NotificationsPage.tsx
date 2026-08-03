import React, { useState } from 'react';
import { Bell, BookOpen, Trophy, Cpu, Check } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { mockNotifications } from '../../data/mockData';

export const NotificationsPage: React.FC = () => {
  const [items, setItems] = useState(mockNotifications);

  const markAllRead = () => {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Notifications & Activity Feed</h1>
          <p className="text-xs text-slate-400">Updates regarding homework, AI reviews, and battles.</p>
        </div>
        <button onClick={markAllRead} className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1">
          <Check className="w-4 h-4" /> Mark All as Read
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className={`p-4 flex items-start gap-3 ${!item.read ? 'border-indigo-500/40 bg-indigo-950/20' : ''}`}>
            <span className="p-2 rounded-lg bg-slate-800 text-indigo-400 shrink-0">
              <Bell className="w-4 h-4" />
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                <span className="text-[10px] text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-xs text-slate-300">{item.message}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
