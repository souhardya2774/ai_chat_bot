
import React from 'react';
import { useAuthenticationStatus } from '@nhost/react';
import { Auth } from './components/Auth';
import { ChatLayout } from './components/ChatLayout';
import { LoadingSpinner } from './components/LoadingSpinner';

function App(): React.ReactNode {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return <ChatLayout />;
}

export default App;
