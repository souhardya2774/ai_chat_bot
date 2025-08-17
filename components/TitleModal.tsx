import React, { useEffect, useRef, useState } from 'react';

interface TitleModalProps {
  isOpen: boolean;
  initialTitle?: string | null;
  onConfirm: (title: string) => void;
  onCancel: () => void;
}

export const TitleModal: React.FC<TitleModalProps> = ({ isOpen, initialTitle = null, onConfirm, onCancel }) => {
  const [title, setTitle] = useState(initialTitle || '');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle || '');
      // focus the input when modal opens
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen, initialTitle]);

  if (!isOpen) return null;

  const isValid = title.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onCancel} />
      <div className="bg-gray-800 text-gray-100 rounded-lg shadow-lg p-6 w-full max-w-md z-10">
        <h3 className="text-lg font-semibold mb-3">New chat title</h3>
        <p className="text-sm text-gray-400 mb-4">Provide a short title for this conversation (required).</p>
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title (required)"
          className="w-full px-3 py-2 mb-4 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(title.trim())}
            className={`px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isValid}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
