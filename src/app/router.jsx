import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from '@/layout/AppShell';
import LandingExperience from '@/features/gate/LandingExperience';
import PlaceholderAcademy from '@/features/academy/PlaceholderAcademy';
import PlaceholderSimulator from '@/features/simulator/PlaceholderSimulator';
import LabsPage from '@/features/labs/LabsPage';
import PlaceholderWatchtower from '@/features/watchtower/PlaceholderWatchtower';
import LogAnalysisLabPage from '@/features/labs/log-analysis/LogAnalysisLabPage';
import PacketExerciseSandboxPage from '@/features/labs/packet-sandbox/PacketExerciseSandboxPage';
import CliChallengesPage from '@/features/labs/cli-challenges/CliChallengesPage';
import SecurityQuizzesPage from '@/features/labs/security-quizzes/SecurityQuizzesPage';
import TerminalSimulationsPage from '@/features/labs/terminal-simulations/TerminalSimulationsPage';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        path: '',
        element: <LandingExperience />,
      },
      {
        path: 'academy',
        element: <ProtectedRoute><PlaceholderAcademy /></ProtectedRoute>,
      },
      {
        path: 'simulator',
        element: <ProtectedRoute><PlaceholderSimulator /></ProtectedRoute>,
      },
      {
        path: 'labs',
        element: <ProtectedRoute><LabsPage /></ProtectedRoute>,
      },
      {
        path: 'labs/log-analysis',
        element: <ProtectedRoute><LogAnalysisLabPage /></ProtectedRoute>,
      },
      {
        path: 'labs/packet-sandbox',
        element: <ProtectedRoute><PacketExerciseSandboxPage /></ProtectedRoute>,
      },
      {
        path: 'labs/cli-challenges',
        element: <ProtectedRoute><CliChallengesPage /></ProtectedRoute>,
      },
      {
        path: 'labs/security-quizzes',
        element: <ProtectedRoute><SecurityQuizzesPage /></ProtectedRoute>,
      },
      {
        path: 'labs/terminal-simulations',
        element: <ProtectedRoute><TerminalSimulationsPage /></ProtectedRoute>,
      },
      {
        path: 'arena',
        element: <Navigate to="/" replace />,
      },
      {
        path: 'dashboard',
        element: <Navigate to="/" replace />,
      },
      {
        path: 'watchtower',
        element: <ProtectedRoute><PlaceholderWatchtower /></ProtectedRoute>,
      },
      {
        path: 'vault',
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: '/quantum-cyber-fortress',
});


