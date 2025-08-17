
import React from 'react';
import type { Message as MessageType } from '../types';
import { Role } from '../types';
import { UserIcon, SparklesIcon } from './Icons';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  const wrapperClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const messageClasses = isUser
    ? 'bg-indigo-600 rounded-lg rounded-br-none'
    : 'bg-gray-700 rounded-lg rounded-bl-none';
  const icon = isUser ? (
    <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center ml-3 order-2">
        <UserIcon className="w-5 h-5"/>
    </div>
  ) : (
    <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center mr-3 order-1">
        <SparklesIcon className="w-5 h-5"/>
    </div>
  );

  return (
    <div className={`${wrapperClasses} items-start`}>
      {icon}
      <div className={`${messageClasses} p-4 max-w-xl text-white order-1`}>
         <div className="prose prose-invert max-w-none">{message.content}</div>
      </div>
    </div>
  );
};
