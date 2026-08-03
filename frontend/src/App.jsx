import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CommandPaletteProvider } from './context/CommandPaletteContext';
import { ToastProvider } from './context/ToastContext';

import { CommandPalette } from './components/ui/CommandPalette';
import { ToastContainer } from './components/ui/ToastContainer';

import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { PricingPage } from './pages/public/PricingPage';
import { FAQPage } from './pages/public/FAQPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { EmailVerificationPage } from './pages/public/EmailVerificationPage';
import { SitemapPage } from './pages/public/SitemapPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { QuestionBankPage } from './pages/student/QuestionBankPage';
import { HomeworkPage } from './pages/student/HomeworkPage';
import { ContestsPage } from './pages/student/ContestsPage';
import { ProjectsPage } from './pages/student/ProjectsPage';
import { SubmissionsPage } from './pages/student/SubmissionsPage';
import { LeaderboardPage } from './pages/student/LeaderboardPage';
import { ProgressPage } from './pages/student/ProgressPage';
import { AIReviewsPage } from './pages/student/AIReviewsPage';
import { AchievementsPage } from './pages/student/AchievementsPage';
import { CalendarPage } from './pages/student/CalendarPage';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { SettingsPage } from './pages/student/SettingsPage';

// Workspace
import { CodingWorkspacePage } from './pages/CodingWorkspacePage';

// Mentor Pages
import { MentorDashboard } from './pages/mentor/MentorDashboard';
import { HomeworkBuilderPage } from './pages/mentor/HomeworkBuilderPage';
import { QuestionBuilderPage } from './pages/mentor/QuestionBuilderPage';
import { MentorContestsPage } from './pages/mentor/MentorContestsPage';
import { MentorStudentsPage } from './pages/mentor/MentorStudentsPage';
import { MentorAnalyticsPage } from './pages/mentor/MentorAnalyticsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { RegistrationQueuePage } from './pages/admin/RegistrationQueuePage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { CollegeManagementPage } from './pages/admin/CollegeManagementPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CommandPaletteProvider>
            <ToastProvider>
              <Router>
                <CommandPalette />
                <ToastContainer />

                <Routes>
                  {/* Public Layout Routes */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/sitemap" element={<SitemapPage />} />
                  </Route>

                  {/* Auth Auth Pages without header wrappers */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/email-verification" element={<EmailVerificationPage />} />

                  {/* High Fidelity Coding Workspace (Full Screen IDE) */}
                  <Route path="/workspace/:problemId" element={<CodingWorkspacePage />} />

                  {/* Authenticated Application Routes (Sidebar Layout) */}
                  <Route element={<AppLayout />}>
                    {/* Student Routes */}
                    <Route path="/dashboard" element={<StudentDashboard />} />
                    <Route path="/questions" element={<QuestionBankPage />} />
                    <Route path="/homework" element={<HomeworkPage />} />
                    <Route path="/contests" element={<ContestsPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/submissions" element={<SubmissionsPage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/progress" element={<ProgressPage />} />
                    <Route path="/ai-reviews" element={<AIReviewsPage />} />
                    <Route path="/achievements" element={<AchievementsPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />

                    {/* Mentor Routes */}
                    <Route path="/mentor" element={<MentorDashboard />} />
                    <Route path="/mentor/homework-builder" element={<HomeworkBuilderPage />} />
                    <Route path="/mentor/question-builder" element={<QuestionBuilderPage />} />
                    <Route path="/mentor/contests" element={<MentorContestsPage />} />
                    <Route path="/mentor/students" element={<MentorStudentsPage />} />
                    <Route path="/mentor/analytics" element={<MentorAnalyticsPage />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/approvals" element={<RegistrationQueuePage />} />
                    <Route path="/admin/users" element={<UserManagementPage />} />
                    <Route path="/admin/colleges" element={<CollegeManagementPage />} />
                    <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
                  </Route>

                  {/* Catch-all redirect to Landing */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </ToastProvider>
          </CommandPaletteProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
