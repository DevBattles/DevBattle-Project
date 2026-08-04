import { Role } from '../types';

/** Landing route for each role after login / redirects. */
export const roleHome = (role?: Role | null): string => {
  if (role === 'admin') return '/admin';
  if (role === 'mentor') return '/mentor';
  return '/dashboard';
};

export const roleLabel = (role?: Role | null): string => {
  if (role === 'admin') return 'Super Admin';
  if (role === 'mentor') return 'Mentor';
  return 'Student';
};
