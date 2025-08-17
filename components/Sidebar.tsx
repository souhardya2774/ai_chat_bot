import React, { useEffect, useRef, useState } from 'react';
import { useSignOut, useUserData } from '@nhost/react';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_CHATS, CHATS_SUBSCRIPTION } from '../graphql/operations';
import type { Chat } from '../types';
import { ChatIcon, LogoutIcon, PlusIcon } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';

interface SidebarProps {
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeChatId, setActiveChatId, onNewChat }) => {
  const { signOut } = useSignOut();
  const userData = useUserData();
  const { data, loading, error } = useQuery<{ chats: Partial<Chat>[] }>(GET_CHATS);
  const { data: subscriptionData, loading: subLoading, error: subError } = useSubscription(CHATS_SUBSCRIPTION);
  const activeChatRef = useRef<HTMLAnchorElement | null>(null);
  const [chats, setChats] = useState<Partial<Chat>[]>([]);

  useEffect(() => {
    if (activeChatRef.current) {
      activeChatRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeChatId]);

  useEffect(() => {
    if (subscriptionData?.chats) {
      // Update the chats data with the subscription data
      setChats(subscriptionData.chats);
    }
  }, [subscriptionData]);

  useEffect(() => {
    if (data?.chats) {
      setChats(data.chats);
    }
  }, [data]);

  return (
    <div className="flex flex-col w-64 bg-gray-800 border-r border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-xl font-semibold">Gemini Chat</h1>
        <button
          onClick={onNewChat}
          className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white"
          title="New Chat"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {(loading || subLoading) && <div className="flex justify-center p-4"><LoadingSpinner /></div>}
        {(error || subError) && <p className="p-2 text-red-400">Error loading chats.</p>}
        {(!loading && !subLoading) && chats.map((chat) => (
          <a
            key={chat.id}
            href="#"
            ref={activeChatId === chat.id ? activeChatRef : null}
            onClick={(e) => {
              e.preventDefault();
              if(chat.id) setActiveChatId(chat.id);
            }}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md truncate ${
              activeChatId === chat.id ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <ChatIcon className="w-5 h-5 mr-3" />
            <span className="flex-1 truncate">{chat.title || 'New Chat'}</span>
          </a>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                {userData?.displayName?.charAt(0).toUpperCase()}
            </div>
            <span className="ml-3 text-sm font-medium truncate">{userData?.email}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-red-800 hover:text-white"
        >
          <LogoutIcon className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};
