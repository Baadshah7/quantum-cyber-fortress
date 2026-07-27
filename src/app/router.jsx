import { createBrowserRouter } from 'react-router-dom';
import AppShell from '@/layout/AppShell';
import LandingExperience from '@/features/gate/LandingExperience';
import PlaceholderAcademy from '@/features/academy/PlaceholderAcademy';
import PlaceholderSimulator from '@/features/simulator/PlaceholderSimulator';
import PlaceholderArena from '@/features/arena/PlaceholderArena';
import PlaceholderDashboard from '@/features/dashboard/PlaceholderDashboard';
import PlaceholderWatchtower from '@/features/watchtower/PlaceholderWatchtower';
import PlaceholderVault from '@/features/vault/PlaceholderVault';

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
        path: 'arena',
        element: <PlaceholderArena />,
      },
      {
        path: 'dashboard',
        element: <PlaceholderDashboard />,
      },
      {
        path: 'watchtower',
        element: <PlaceholderWatchtower />,
      },
      {
        path: 'vault',
        element: <PlaceholderVault />,
      },
    ],
  },
], {
  basename: '/quantum-cyber-fortress',
});

