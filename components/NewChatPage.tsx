import { CREATE_CHAT } from '@/graphql/operations';
import { useMutation } from '@apollo/client';
import React, { useState } from 'react';

interface NewChatPageProps {
  setActiveChatId: (id: string | null) => void;
}

const NewChatPage: React.FC<NewChatPageProps> = ({ setActiveChatId }) => {
  const [title, setTitle] = useState("");
  const [error,setError] = useState<string | null>(null);
  const [createChat] = useMutation(CREATE_CHAT);

  const handleConfirm = async () => {
    if (title.trim()) {
      try {
        const result = await createChat({ variables: { title: title.trim() } });
        if (result.data?.insert_chats_one?.id) {
          const currentChatId = result.data.insert_chats_one.id;
          console.log("Created new chat with ID:", currentChatId);
          setActiveChatId(currentChatId);
        } else {
          throw new Error("Failed to create chat");
        }
      } catch (err) {
        console.error("Error creating chat:", err);
        setError(err.message || "An error occurred while creating the chat!");
        return;
      }
    }else {
      setError("Chat title cannot be empty!");
    }
  };

  

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <header className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">New Chat</h1>
      </header>
      <main className="flex-1 p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Enter a title for your chat</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Chat title"
            className="w-full px-4 py-2 mb-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setTitle("")}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Clear
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
            >
              Confirm
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </main>
    </div>
  );
};

export default NewChatPage;
