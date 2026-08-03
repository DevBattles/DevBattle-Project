import React from 'react';
import { Shield, Users, Building2, FileText, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { pendingUsers } = useAuth();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="rose" icon={<Shield className="w-3.5 h-3.5" />}>
              Super Admin Console
            </Badge>
            <span className="text-xs text-slate-400">Global Governance & Hierarchy</span>
          </div>
          <h1 className="text-2xl font-black text-slate-100">DevBattles Platform Administration</h1>
          <p className="text-xs text-slate-400">Oversight of all colleges, user registrations, role permissions, and audit logs.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="glow" icon={<UserCheck className="w-4 h-4" />} onClick={() => navigate('/admin/approvals')}>
            Review Registration Queue ({pendingUsers.length})
          </Button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Platform Users" value="150,420" icon={<Users className="w-5 h-5 text-indigo-400" />} subtitle="Active Across 180 Campuses" />
        <StatCard title="Partner Colleges" value="184" icon={<Building2 className="w-5 h-5 text-cyan-400" />} subtitle="5,200 Batches Managed" />
        <StatCard title="Pending Registrations" value={`${pendingUsers.length} Requests`} icon={<UserCheck className="w-5 h-5 text-amber-400" />} subtitle="Requires Admin Approval" />
        <StatCard title="System Health" value="100% Operational" icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />} subtitle="32ms API Latency" />
      </div>

      {/* REGISTRATION APPROVAL SUMMARY */}
      <Card className="p-6 space-y-4 border-amber-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">Pending Account Approval Queue</h3>
            <p className="text-xs text-slate-400">New students and mentors awaiting admin verification</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => navigate('/admin/approvals')}>
            Manage All ({pendingUsers.length})
          </Button>
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          {pendingUsers.map((u) => (
            <div key={u.id} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">{u.name}</span>
                <span className="text-slate-500">{u.email} · {u.collegeName} ({u.role.toUpperCase()})</span>
              </div>
              <Badge variant="amber">Awaiting Approval</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
