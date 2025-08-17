import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChatView } from './ChatView';
import NewChatPage from './NewChatPage';

export const ChatLayout: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-gray-100">
      <Sidebar 
        activeChatId={activeChatId} 
        setActiveChatId={setActiveChatId} 
        onNewChat={() => setActiveChatId(null)} 
      />
      <main className="flex-1 flex flex-col">
        {
          activeChatId === null
          ? <NewChatPage 
              setActiveChatId={setActiveChatId}
            />
          : <ChatView 
              key={activeChatId}
              activeChatId={activeChatId} 
              setActiveChatId={setActiveChatId} 
            />
        }
      </main>
    </div>
  );
};
