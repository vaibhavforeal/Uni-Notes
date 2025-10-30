import React, { useState, useMemo } from 'react';
import { Note } from '../types';
import NoteCard from './NoteCard';

interface StudentViewProps {
  notes: Note[];
  viewNote: (note: Note) => void;
  toggleBookmark: (id: string) => void;
}

const StudentView: React.FC<StudentViewProps> = ({ notes, viewNote, toggleBookmark }) => {
    const [filter, setFilter] = useState<'all' | 'bookmarked'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNotes = useMemo(() => {
        return notes
            .filter(note => {
                if (filter === 'bookmarked') {
                    return note.isBookmarked;
                }
                return true;
            })
            .filter(note => {
                const lowercasedTerm = searchTerm.toLowerCase();
                return (
                    note.title.toLowerCase().includes(lowercasedTerm) ||
                    note.subject.toLowerCase().includes(lowercasedTerm)
                );
            });
    }, [notes, filter, searchTerm]);

    const groupedNotes = useMemo(() => {
        return filteredNotes.reduce((acc, note) => {
            const { subject } = note;
            if (!acc[subject]) {
                acc[subject] = [];
            }
            acc[subject].push(note);
            return acc;
        }, {} as Record<string, Note[]>);
    }, [filteredNotes]);


    return (
        <div>
            <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto flex-grow">
                     <input
                        type="text"
                        placeholder="Search notes by title or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex items-center bg-gray-200 dark:bg-gray-700 p-1 rounded-full">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full ${filter === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        All Notes
                    </button>
                    <button
                        onClick={() => setFilter('bookmarked')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full ${filter === 'bookmarked' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        Bookmarked
                    </button>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Class Notes ({filteredNotes.length})</h2>
                {filteredNotes.length > 0 ? (
                    <div className="space-y-8">
                        {Object.entries(groupedNotes)
                        .sort(([subjectA], [subjectB]) => subjectA.localeCompare(subjectB))
                        .map(([subject, notesInSubject]) => (
                            <div key={subject}>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-4">
                                    {subject}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {notesInSubject.map(note => (
                                        <NoteCard
                                            key={note.id}
                                            note={note}
                                            onView={viewNote}
                                            onToggleBookmark={toggleBookmark}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                         <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {searchTerm ? 'No notes match your search.' : 'No notes found.'}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                           {filter === 'bookmarked' && !searchTerm ? 'You have not bookmarked any notes yet.' : 'Try adjusting your filters or search term.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentView;