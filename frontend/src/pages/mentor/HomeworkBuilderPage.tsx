import React, { useState } from 'react';
import { BookOpen, Plus, Send, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import { mockQuestions, mockColleges } from '../../data/mockData';

export const HomeworkBuilderPage: React.FC = () => {
  const { addToast } = useToast();
  const [title, setTitle] = useState('Data Structures Sprint #5');
  const [description, setDescription] = useState('Solve 2 algorithmic array problems before Friday midnight.');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>(['q-101']);
  const [dueDate, setDueDate] = useState('2026-08-15');

  const handleToggleQuestion = (id: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Homework Assigned!', `Assigned "${title}" to KR Mangalam University Batch 2025 Section A.`);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-slate-100">Homework Assignment Builder</h1>
        <p className="text-xs text-slate-400">Configure batch assignments, select problem sets, and set deadlines.</p>
      </div>

      <Card className="p-6 space-y-6">
        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Homework Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Instructions & Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Target College & Batch</label>
              <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200">
                <option>{"KR Mangalam University → CSE → Batch 2025 Sec A"}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Select Questions from Question Bank ({selectedQuestions.length} Selected)
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {mockQuestions.map((q) => {
                const isSelected = selectedQuestions.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleQuestion(q.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected ? 'border-indigo-500 bg-indigo-950/40 text-white font-bold' : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <span>{q.title} ({q.difficulty})</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          <Button type="submit" variant="glow" icon={<Send className="w-4 h-4" />}>
            Assign Homework to Batch
          </Button>
        </form>
      </Card>
    </div>
  );
};
