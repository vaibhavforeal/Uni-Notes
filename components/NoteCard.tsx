import React from 'react';
import { Note } from '../types';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { PencilIcon } from './icons/PencilIcon';

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
  onView: (note: Note) => void;
  onToggleBookmark?: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onView, onToggleBookmark }) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(note.uploadedAt));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col justify-between transition-transform transform hover:-translate-y-1 hover:shadow-xl">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {note.subject}
          </span>
           {note.studentNote && (
            <div className="flex items-center text-gray-400" title="You have a personal note on this item">
                <PencilIcon />
            </div>
           )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{note.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Uploaded on {formattedDate}</p>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between">
        <button
          onClick={() => onView(note)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800"
        >
          <BookOpenIcon />
          <span className="ml-2">View Note</span>
        </button>
        <div className="flex items-center space-x-2">
            {onToggleBookmark && (
                <button
                    onClick={() => onToggleBookmark(note.id)}
                    className={`p-2 rounded-full ${note.isBookmarked ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'} hover:bg-gray-200 dark:hover:bg-gray-600`}
                    aria-label="Bookmark note"
                >
                    <BookmarkIcon isBookmarked={!!note.isBookmarked} />
                </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(note.id)}
                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full p-2"
                aria-label="Delete note"
              >
                <DeleteIcon />
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;