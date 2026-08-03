import React, { useState } from 'react';
import { Code2, Plus, Send } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const QuestionBuilderPage: React.FC = () => {
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Custom Question Created!', `"${title}" has been published to your college problem library.`);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-slate-100">Custom Question Builder</h1>
        <p className="text-xs text-slate-400">Design custom DSA or Frontend challenges with starter code and test cases.</p>
      </div>

      <Card className="p-6 space-y-4">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Question Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Design a Circular Buffer"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Problem Category</label>
              <input
                type="text"
                placeholder="e.g. Queue Data Structure"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Problem Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description, inputs, and O(n) runtime constraints..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
            />
          </div>

          <Button type="submit" variant="glow" icon={<Plus className="w-4 h-4" />}>
            Publish Question to College Bank
          </Button>
        </form>
      </Card>
    </div>
  );
};
