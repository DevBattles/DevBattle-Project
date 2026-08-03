import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AuditLog, Batch, Branch, College } from '../types';
import { mockAuditLogs, mockColleges } from '../data/mockData';
import { createId, readStorage, timestampNow, writeStorage } from '../utils/storage';

/**
 * Platform data store (college hierarchy + audit trail).
 *
 * There is no backend in this repo yet, so mutations live in React state and are
 * mirrored into localStorage so they survive reloads. Swap the bodies below for
 * API calls once the DevBattles service exists - the hook API stays identical.
 */

const STORAGE_KEY = 'devbattles.platform.v1';

export interface NewCollegeInput {
  name: string;
  code: string;
  firstBranchName?: string;
}

export interface NewBatchInput {
  name: string;
  year: number;
  mentorName: string;
  studentCount?: number;
  sections?: string[];
}

export interface AuditEntryInput {
  actor: string;
  action: string;
  target: string;
  status?: AuditLog['status'];
}

export interface MutationResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

interface DataContextType {
  colleges: College[];
  auditLogs: AuditLog[];
  addCollege: (input: NewCollegeInput) => MutationResult<College>;
  deleteCollege: (collegeId: string) => MutationResult;
  addBranch: (collegeId: string, name: string) => MutationResult<Branch>;
  addBatch: (collegeId: string, branchId: string, input: NewBatchInput) => MutationResult<Batch>;
  addAuditLog: (entry: AuditEntryInput) => void;
  resetPlatformData: () => void;
}

interface PersistedData {
  colleges: College[];
  auditLogs: AuditLog[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const seed = (): PersistedData => ({
  colleges: mockColleges,
  auditLogs: mockAuditLogs,
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedData>(() => {
    const stored = readStorage<PersistedData | null>(STORAGE_KEY, null);
    if (stored && Array.isArray(stored.colleges) && Array.isArray(stored.auditLogs)) return stored;
    return seed();
  });

  useEffect(() => {
    writeStorage(STORAGE_KEY, state);
  }, [state]);

  const { colleges, auditLogs } = state;

  const addAuditLog = useCallback((entry: AuditEntryInput) => {
    const log: AuditLog = {
      id: createId('log'),
      actor: entry.actor,
      action: entry.action,
      target: entry.target,
      timestamp: timestampNow(),
      ipAddress: '127.0.0.1',
      status: entry.status ?? 'success',
    };
    setState((prev) => ({ ...prev, auditLogs: [log, ...prev.auditLogs] }));
  }, []);

  const addCollege = useCallback(
    (input: NewCollegeInput): MutationResult<College> => {
      const name = input.name.trim();
      const code = input.code.trim().toUpperCase();

      if (!name) return { ok: false, error: 'College name is required.' };
      if (!code) return { ok: false, error: 'Short campus code is required.' };

      const duplicate = colleges.some(
        (c) => c.name.toLowerCase() === name.toLowerCase() || c.code.toUpperCase() === code
      );
      if (duplicate) return { ok: false, error: 'A campus with this name or code already exists.' };

      const branchName = input.firstBranchName?.trim();
      const college: College = {
        id: createId('col'),
        name,
        code,
        branches: branchName ? [{ id: createId('br'), name: branchName, batches: [] }] : [],
      };

      setState((prev) => ({ ...prev, colleges: [...prev.colleges, college] }));
      return { ok: true, data: college };
    },
    [colleges]
  );

  const deleteCollege = useCallback(
    (collegeId: string): MutationResult => {
      if (!colleges.some((c) => c.id === collegeId)) return { ok: false, error: 'College not found.' };
      setState((prev) => ({ ...prev, colleges: prev.colleges.filter((c) => c.id !== collegeId) }));
      return { ok: true };
    },
    [colleges]
  );

  const addBranch = useCallback(
    (collegeId: string, rawName: string): MutationResult<Branch> => {
      const name = rawName.trim();
      if (!name) return { ok: false, error: 'Branch name is required.' };

      const college = colleges.find((c) => c.id === collegeId);
      if (!college) return { ok: false, error: 'College not found.' };
      if (college.branches.some((b) => b.name.toLowerCase() === name.toLowerCase())) {
        return { ok: false, error: 'This branch already exists on the campus.' };
      }

      const branch: Branch = { id: createId('br'), name, batches: [] };
      setState((prev) => ({
        ...prev,
        colleges: prev.colleges.map((c) =>
          c.id === collegeId ? { ...c, branches: [...c.branches, branch] } : c
        ),
      }));
      return { ok: true, data: branch };
    },
    [colleges]
  );

  const addBatch = useCallback(
    (collegeId: string, branchId: string, input: NewBatchInput): MutationResult<Batch> => {
      const name = input.name.trim();
      if (!name) return { ok: false, error: 'Batch name is required.' };

      const college = colleges.find((c) => c.id === collegeId);
      const branch = college?.branches.find((b) => b.id === branchId);
      if (!college || !branch) return { ok: false, error: 'Branch not found.' };
      if (branch.batches.some((b) => b.name.toLowerCase() === name.toLowerCase())) {
        return { ok: false, error: 'A batch with this name already exists in the branch.' };
      }

      const batch: Batch = {
        id: createId('batch'),
        name,
        year: input.year,
        sections: input.sections?.length ? input.sections : ['Section A'],
        studentCount: input.studentCount ?? 0,
        mentorId: createId('usr-mentor'),
        mentorName: input.mentorName.trim() || 'Unassigned',
      };

      setState((prev) => ({
        ...prev,
        colleges: prev.colleges.map((c) =>
          c.id !== collegeId
            ? c
            : {
                ...c,
                branches: c.branches.map((b) =>
                  b.id === branchId ? { ...b, batches: [...b.batches, batch] } : b
                ),
              }
        ),
      }));
      return { ok: true, data: batch };
    },
    [colleges]
  );

  const resetPlatformData = useCallback(() => setState(seed()), []);

  return (
    <DataContext.Provider
      value={{
        colleges,
        auditLogs,
        addCollege,
        deleteCollege,
        addBranch,
        addBatch,
        addAuditLog,
        resetPlatformData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
