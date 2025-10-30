import React, { useState } from 'react';
import { Note, UserRole } from '../types';
import { CloseIcon } from './icons/CloseIcon';

interface NoteViewerModalProps {
  note: Note;
  onClose: () => void;
  userRole: UserRole;
  updateStudentNote: (noteId: string, text: string) => void;
}

const NoteViewerModal: React.FC<NoteViewerModalProps> = ({ note, onClose, userRole, updateStudentNote }) => {
  const [personalNote, setPersonalNote] = useState(note.studentNote || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSaveNote = () => {
    setSaveStatus('saving');
    updateStudentNote(note.id, personalNote);
    setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const renderSaveButtonContent = () => {
    switch(saveStatus) {
        case 'saving':
            return 'Saving...';
        case 'saved':
            return 'Saved!';
        default:
            return 'Save Note';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 truncate" title={note.title}>{note.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{note.subject} - {note.fileName}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 p-2 rounded-full">
            <CloseIcon />
          </button>
        </header>

        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="flex-1 h-full overflow-y-auto">
            {note.fileType === 'pdf' ? (
              <iframe
                src={note.content}
                title={note.title}
                className="w-full h-full border-none"
              />
            ) : (
              <div className="p-6 h-full">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto">
                      {note.content}
                  </pre>
              </div>
            )}
          </div>

          {userRole === UserRole.Student && (
            <div className="w-full md:w-1/3 h-full flex flex-col border-t-2 md:border-t-0 md:border-l-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">My Personal Notes</h3>
                <div className="p-4 flex-1 overflow-y-auto">
                    <textarea
                        value={personalNote}
                        onChange={(e) => setPersonalNote(e.target.value)}
                        placeholder="Add your thoughts, questions, or summaries here..."
                        className="w-full h-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
                    />
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <button
                        onClick={handleSaveNote}
                        disabled={saveStatus === 'saving'}
                        className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                            saveStatus === 'saved' ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400'
                        }`}
                    >
                        {renderSaveButtonContent()}
                    </button>
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default NoteViewerModal;
