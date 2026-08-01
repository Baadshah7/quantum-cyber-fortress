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
        element: <PlaceholderAcademy />,
      },
      {
        path: 'simulator',
        element: <PlaceholderSimulator />,
      },
      {
        path: 'labs',
        element: <LabsPage />,
      },
      {
        path: 'labs/log-analysis',
        element: <LogAnalysisLabPage />,
      },
      {
        path: 'labs/packet-sandbox',
        element: <PacketExerciseSandboxPage />,
      },
      {
        path: 'labs/cli-challenges',
        element: <CliChallengesPage />,
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
        element: <PlaceholderWatchtower />,
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

