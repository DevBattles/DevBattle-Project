import React, { useState } from 'react';
import { Settings, Moon, Sun, Key, User } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [apiKey, setApiKey] = useState('db_live_9942a1b88e02f9');

  const handleSave = () => {
    addToast('success', 'Settings Saved', 'Your user preferences have been updated.');
  };

  return (
    <div className="space-y-8 pb-12 max-w-3xl">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-slate-100">Account & Preference Settings</h1>
        <p className="text-xs text-slate-400">Configure theme, notifications, and API integrations.</p>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          Appearance & Theme Mode
        </h3>
        <p className="text-xs text-slate-400">Toggle between Dark Mode (default developer aesthetic) and Light Mode.</p>
        <Button variant="secondary" size="sm" onClick={toggleTheme}>
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </Button>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-400" />
          DevBattles API Key
        </h3>
        <p className="text-xs text-slate-400">Use this API key for CLI submission tools and VS Code extensions.</p>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-emerald-400"
        />
        <Button variant="primary" size="sm" onClick={handleSave}>
          Save Key Settings
        </Button>
      </Card>
    </div>
  );
};
