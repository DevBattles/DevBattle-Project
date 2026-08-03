import React, { createContext, useContext, useState } from 'react';
import { User, Role } from '../types';
import { mockUsers, mockPendingApprovals } from '../data/mockData';

interface AuthContextType {
  currentUser: User;
  role: Role;
  switchRole: (role: Role) => void;
  pendingUsers: User[];
  approveUser: (userId: string, role: Role) => void;
  rejectUser: (userId: string) => void;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('student');
  const [pendingUsers, setPendingUsers] = useState<User[]>(mockPendingApprovals);

  const currentUser = mockUsers.find((u) => u.role === role) || mockUsers[0];

  const switchRole = (newRole: Role) => {
    setRole(newRole);
  };

  const approveUser = (userId: string, assignedRole: Role) => {
    setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const rejectUser = (userId: string) => {
    setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const updateUserStatus = (userId: string, status: 'active' | 'suspended') => {
    // mock update
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        switchRole,
        pendingUsers,
        approveUser,
        rejectUser,
        updateUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
