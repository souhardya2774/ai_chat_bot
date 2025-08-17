import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { GET_MESSAGES_FOR_CHAT, CREATE_CHAT, GET_CHATS, UPDATE_CHAT_TITLE, GET_CHAT, SEND_MESSAGE, MESSAGES_SUBSCRIPTION } from '../graphql/operations';
import type { Message as MessageType } from '../types';
import { Role } from '../types';
import { Message } from './Message';
import { LoadingSpinner } from './LoadingSpinner';
import { SendIcon, SparklesIcon } from './Icons';

interface ChatViewProps {
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  newChatTitle?: string | null;
  onConsumeNewChatTitle?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ activeChatId, setActiveChatId }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const { data: chatData } = useQuery(GET_CHAT, {
    variables: { chat_id: activeChatId },
    skip: !activeChatId,
  });

  // Initial query to get messages
  const { loading: queryLoading, error: queryError } = useQuery(GET_MESSAGES_FOR_CHAT, {
    variables: { chat_id: activeChatId },
    skip: !activeChatId,
    onCompleted: (data) => {
      console.log("Messages loaded:", data.messages);
      if (data?.messages) {
        setMessages(data.messages);
      }
    }
  });

  // Subscription for real-time updates
  const { data: subscriptionData, loading: subLoading, error: subError } = useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { chat_id: activeChatId },
    skip: !activeChatId,
    shouldResubscribe: true,
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  useEffect(() => {
    if (subscriptionData?.messages) {
      // Compare with current messages to avoid duplicate renders
      const newMessages = subscriptionData.messages;
      setMessages(prevMessages => {
        // If length or last message is different, update
        if (prevMessages.length !== newMessages.length || 
            prevMessages[prevMessages.length - 1]?.id !== newMessages[newMessages.length - 1]?.id) {
          return newMessages;
        }
        return prevMessages;
      });
    }
  }, [subscriptionData]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userInput = input.trim();
    setInput('');

    setIsStreaming(true);
    // Add a temporary message to the state
    const tempMessage:MessageType = {
      id: `temp-${Date.now()}`,
      created_at: new Date().toISOString(),
      role: Role.USER,
      content: userInput,
    };
    setMessages((prevMessages) => [...prevMessages, tempMessage]);
    try {
      const result = await sendMessage({
        variables: {
          arg1: {
            chat_id: activeChatId,
            message: userInput,
          },
        },
      });

      if (!result.data?.sendMessage.success) {
        throw new Error(result.data?.sendMessage.error || 'Failed to send message');
      }

      // Replace the temporary message with the actual message from the server
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === tempMessage.id ? result.data.sendMessage.message : msg
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
      // Remove the temporary message in case of an error
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== tempMessage.id)
      );
    } finally {
      setIsStreaming(false);
    }
  };

  // Titles are provided by the client when creating a chat. No AI title generation here.

  if ( messages.length === 0 ) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <button onClick={() => setActiveChatId(null)} className="text-gray-300 hover:text-white">Back</button>
            <h2 className="text-lg font-semibold truncate">{chatData?.chats_by_pk?.title || 'Untitled Chat'}</h2>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <SparklesIcon className="w-16 h-16 text-indigo-400 mb-4" />
            <h2 className="text-2xl font-semibold">Welcome to Gemini Chat</h2>
            <p className="text-gray-400 mt-2">Start a new conversation by typing your message below.</p>
        </div>
        <div className="p-4 border-t border-gray-700">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" disabled={!input.trim() || isStreaming} className="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed">
                <SendIcon className="w-6 h-6" />
                </button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <button onClick={() => setActiveChatId(null)} className="text-gray-300 hover:text-white">Back</button>
          <h2 className="text-lg font-semibold truncate">{chatData?.chats_by_pk?.title || 'Untitled Chat'}</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {(queryLoading || subLoading) && <div className="flex justify-center"><LoadingSpinner /></div>}
        {(queryError || subError) && (
          <p className="text-red-400 text-center">
            Error loading messages: {queryError?.message || subError?.message}
          </p>
        )}
        {(!queryLoading && !subLoading) && messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isStreaming && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg rounded-bl-none max-w-xl">
               <LoadingSpinner />
               <span className="text-gray-400 italic">Processing message...</span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isStreaming || queryLoading || subLoading}
          />
          <button type="submit" disabled={!input.trim() || isStreaming || queryLoading || subLoading} className="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed">
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};
