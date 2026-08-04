import React, { useState } from 'react';
import { Building2, Plus, Trash2, Layers, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { College } from '../../types';

const inputClass =
  'w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500';

export const CollegeManagementPage: React.FC = () => {
  const { colleges, addCollege, addBranch, addBatch, deleteCollege, addAuditLog } = useData();
  const { currentUser, users } = useAuth();
  const { addToast } = useToast();

  const [isCollegeModalOpen, setCollegeModalOpen] = useState(false);
  const [branchTarget, setBranchTarget] = useState<College | null>(null);
  const [batchTarget, setBatchTarget] = useState<{ college: College; branchId: string; branchName: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<College | null>(null);
  const [error, setError] = useState('');

  // College form
  const [collegeName, setCollegeName] = useState('');
  const [collegeCode, setCollegeCode] = useState('');
  const [firstBranch, setFirstBranch] = useState('');

  // Branch + batch forms
  const [branchName, setBranchName] = useState('');
  const [batchName, setBatchName] = useState('');
  const [batchYear, setBatchYear] = useState(String(new Date().getFullYear()));
  const [batchMentor, setBatchMentor] = useState('');

  const actor = currentUser?.name ?? 'Super Admin';

  const closeAll = () => {
    setCollegeModalOpen(false);
    setBranchTarget(null);
    setBatchTarget(null);
    setError('');
  };

  const handleAddCollege = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addCollege({ name: collegeName, code: collegeCode, firstBranchName: firstBranch });

    if (!result.ok) {
      setError(result.error ?? 'Unable to add campus.');
      return;
    }

    addAuditLog({ actor, action: 'Created College Campus', target: `${collegeName.trim()} (${collegeCode.trim().toUpperCase()})` });
    addToast('success', 'Campus Added', `${collegeName.trim()} is now live and selectable during registration.`);
    setCollegeName('');
    setCollegeCode('');
    setFirstBranch('');
    closeAll();
  };

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchTarget) return;

    const result = addBranch(branchTarget.id, branchName);
    if (!result.ok) {
      setError(result.error ?? 'Unable to add branch.');
      return;
    }

    addAuditLog({ actor, action: 'Created Academic Branch', target: `${branchTarget.name} → ${branchName.trim()}` });
    addToast('success', 'Branch Added', `${branchName.trim()} added to ${branchTarget.name}.`);
    setBranchName('');
    closeAll();
  };

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchTarget) return;

    const result = addBatch(batchTarget.college.id, batchTarget.branchId, {
      name: batchName,
      year: Number(batchYear) || new Date().getFullYear(),
      mentorName: batchMentor,
    });

    if (!result.ok) {
      setError(result.error ?? 'Unable to add batch.');
      return;
    }

    addAuditLog({ actor, action: 'Created Student Batch', target: `${batchTarget.branchName} → ${batchName.trim()}` });
    addToast('success', 'Batch Created', `${batchName.trim()} is ready for student mapping.`);
    setBatchName('');
    setBatchMentor('');
    closeAll();
  };

  const handleDeleteCollege = () => {
    if (!deleteTarget) return;
    const result = deleteCollege(deleteTarget.id);

    if (!result.ok) {
      addToast('error', 'Delete Failed', result.error);
    } else {
      addAuditLog({ actor, action: 'Deleted College Campus', target: deleteTarget.name, status: 'warning' });
      addToast('warning', 'Campus Removed', `${deleteTarget.name} has been removed from the hierarchy.`);
    }
    setDeleteTarget(null);
  };

  /** Registered users mapped to a campus, so counts reflect real approvals. */
  const enrolledCount = (college: College) => users.filter((u) => u.collegeId === college.id).length;

  const mentorOptions = users.filter((u) => u.role === 'mentor');

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-100">College & Campus Hierarchy Management</h1>
          <p className="text-xs text-slate-400">Platform → College → Branch → Batch → Mentor → Student structure.</p>
        </div>
        <Button
          variant="glow"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setError('');
            setCollegeModalOpen(true);
          }}
        >
          Add New College Campus
        </Button>
      </div>

      {colleges.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No campuses configured yet</h3>
          <p className="text-xs text-slate-400">Add your first college so students and mentors can register against it.</p>
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setCollegeModalOpen(true)}>
            Add College Campus
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {colleges.map((college) => (
            <Card key={college.id} className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {college.name} ({college.code})
                    </h3>
                    <span className="text-xs text-slate-400">
                      {college.branches.length} Academic Branches · {enrolledCount(college)} Registered Users
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="cyan">Active Campus</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Plus className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setError('');
                      setBranchTarget(college);
                    }}
                  >
                    Add Branch
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    onClick={() => setDeleteTarget(college)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800">
                {college.branches.length === 0 && (
                  <p className="text-xs text-slate-500 py-2">No branches yet. Add a branch to start mapping batches.</p>
                )}

                {college.branches.map((br) => (
                  <div key={br.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-300 text-xs block">{br.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={<Layers className="w-3.5 h-3.5" />}
                        onClick={() => {
                          setError('');
                          setBatchTarget({ college, branchId: br.id, branchName: br.name });
                        }}
                      >
                        Add Batch
                      </Button>
                    </div>

                    {br.batches.length === 0 ? (
                      <p className="text-[11px] text-slate-500">No batches configured for this branch yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {br.batches.map((batch) => (
                          <div
                            key={batch.id}
                            className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center"
                          >
                            <div>
                              <span className="font-semibold text-slate-200 block">{batch.name}</span>
                              <span className="text-slate-500 text-[10px]">Mentor: {batch.mentorName}</span>
                            </div>
                            <span className="text-indigo-400 font-bold">{batch.studentCount} Students</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ADD COLLEGE */}
      <Modal isOpen={isCollegeModalOpen} onClose={closeAll} title="Add New College Campus">
        <form onSubmit={handleAddCollege} className="space-y-4">
          <div>
            <label htmlFor="col-name" className="block text-xs font-bold text-slate-300 mb-1">
              College Name
            </label>
            <input
              id="col-name"
              required
              autoFocus
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="e.g. Delhi Technological University"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="col-code" className="block text-xs font-bold text-slate-300 mb-1">
              Campus Code
            </label>
            <input
              id="col-code"
              required
              value={collegeCode}
              onChange={(e) => setCollegeCode(e.target.value.toUpperCase())}
              placeholder="e.g. DTU"
              maxLength={10}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="col-branch" className="block text-xs font-bold text-slate-300 mb-1">
              First Branch <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              id="col-branch"
              value={firstBranch}
              onChange={(e) => setFirstBranch(e.target.value)}
              placeholder="e.g. Computer Science & Engineering"
              className={inputClass}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-[11px] text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={closeAll}>
              Cancel
            </Button>
            <Button type="submit" variant="glow" size="sm">
              Create Campus
            </Button>
          </div>
        </form>
      </Modal>

      {/* ADD BRANCH */}
      <Modal isOpen={Boolean(branchTarget)} onClose={closeAll} title={`Add Branch · ${branchTarget?.name ?? ''}`}>
        <form onSubmit={handleAddBranch} className="space-y-4">
          <div>
            <label htmlFor="br-name" className="block text-xs font-bold text-slate-300 mb-1">
              Branch / Department Name
            </label>
            <input
              id="br-name"
              required
              autoFocus
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="e.g. Electronics & Communication"
              className={inputClass}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-[11px] text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={closeAll}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Add Branch
            </Button>
          </div>
        </form>
      </Modal>

      {/* ADD BATCH */}
      <Modal isOpen={Boolean(batchTarget)} onClose={closeAll} title={`Add Batch · ${batchTarget?.branchName ?? ''}`}>
        <form onSubmit={handleAddBatch} className="space-y-4">
          <div>
            <label htmlFor="batch-name" className="block text-xs font-bold text-slate-300 mb-1">
              Batch Name
            </label>
            <input
              id="batch-name"
              required
              autoFocus
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              placeholder="e.g. Batch 2027 - Section A"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="batch-year" className="block text-xs font-bold text-slate-300 mb-1">
                Graduation Year
              </label>
              <input
                id="batch-year"
                type="number"
                min={2000}
                max={2100}
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="batch-mentor" className="block text-xs font-bold text-slate-300 mb-1">
                Assigned Mentor
              </label>
              <input
                id="batch-mentor"
                list="mentor-options"
                value={batchMentor}
                onChange={(e) => setBatchMentor(e.target.value)}
                placeholder="Unassigned"
                className={inputClass}
              />
              <datalist id="mentor-options">
                {mentorOptions.map((m) => (
                  <option key={m.id} value={m.name} />
                ))}
              </datalist>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-[11px] text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={closeAll}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Batch
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteCollege}
        title={`Delete ${deleteTarget?.name ?? 'campus'}?`}
        description="All branches and batches under this campus will be removed from the hierarchy. Existing user accounts are not deleted."
        confirmLabel="Delete Campus"
      />
    </div>
  );
};
