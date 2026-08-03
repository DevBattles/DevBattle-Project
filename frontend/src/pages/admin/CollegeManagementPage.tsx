import React from 'react';
import { Building2, Plus, ChevronRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { mockColleges } from '../../data/mockData';

export const CollegeManagementPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-100">College & Campus Hierarchy Management</h1>
          <p className="text-xs text-slate-400">Platform → College → Branch → Batch → Mentor → Student structure.</p>
        </div>
        <Button variant="glow" icon={<Plus className="w-4 h-4" />}>Add New College Campus</Button>
      </div>

      <div className="space-y-6">
        {mockColleges.map((college) => (
          <Card key={college.id} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{college.name} ({college.code})</h3>
                  <span className="text-xs text-slate-400">{college.branches.length} Academic Branches</span>
                </div>
              </div>
              <Badge variant="cyan">Active Campus</Badge>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800">
              {college.branches.map((br) => (
                <div key={br.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-indigo-300 text-xs block">{br.name}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {br.batches.map((batch) => (
                      <div key={batch.id} className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-slate-200 block">{batch.name}</span>
                          <span className="text-slate-500 text-[10px]">Mentor: {batch.mentorName}</span>
                        </div>
                        <span className="text-indigo-400 font-bold">{batch.studentCount} Students</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
