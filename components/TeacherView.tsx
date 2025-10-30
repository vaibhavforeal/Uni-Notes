import React, { useState, useMemo } from 'react';
import { Note } from '../types';
import NoteCard from './NoteCard';
import { UploadIcon } from './icons/UploadIcon';

interface TeacherViewProps {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'uploadedAt'>) => void;
  deleteNote: (id: string) => void;
  viewNote: (note: Note) => void;
}

const TeacherView: React.FC<TeacherViewProps> = ({ notes, addNote, deleteNote, viewNote }) => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState<'text' | 'pdf'>('text');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Increased file size limit to 5MB for PDFs
        if (file.size > 5 * 1024 * 1024) { 
            alert('File size exceeds 5MB limit.');
            return;
        }

        setFileName(file.name);
        setTitle(file.name.replace(/\.[^/.]+$/, "")); // Auto-fill title from filename
        
        if (file.type === 'application/pdf') {
            setFileType('pdf');
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                setContent(loadEvent.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'text/plain') {
            setFileType('text');
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                setContent(loadEvent.target?.result as string);
            };
            reader.readAsText(file);
        } else {
            alert('Unsupported file type. Please upload a .txt or .pdf file.');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !subject || !content) {
            alert('Please fill in all fields.');
            return;
        }

        addNote({
            title,
            subject,
            content,
            fileType,
            fileName: fileName || `${title.replace(/\s+/g, '_').toLowerCase()}.txt`,
        });

        // Reset form
        setTitle('');
        setSubject('');
        setContent('');
        setFileName('');
        setFileType('text');
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    };

    const groupedNotes = useMemo(() => {
        return notes.reduce((acc, note) => {
            const { subject } = note;
            if (!acc[subject]) {
                acc[subject] = [];
            }
            acc[subject].push(note);
            return acc;
        }, {} as Record<string, Note[]>);
    }, [notes]);


    return (
        <div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-bold mb-4">Upload New Note</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                        <div className="mt-1 flex flex-col space-y-2">
                             <textarea
                                id="content"
                                rows={5}
                                value={fileType === 'pdf' ? 'PDF content is embedded and cannot be edited here.' : content}
                                onChange={(e) => {
                                    setContent(e.target.value)
                                    setFileType('text');
                                    setFileName('');
                                }}
                                className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Type or paste content here..."
                                disabled={fileType === 'pdf'}
                            />
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 border border-gray-300 dark:border-gray-600 p-2 text-center">
                                <span>{fileName ? `File: ${fileName}` : "Or Upload a File (.txt, .pdf)"}</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,text/plain,.pdf,application/pdf" />
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <UploadIcon />
                            <span className="ml-2">Add Note</span>
                        </button>
                    </div>
                </form>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Uploaded Notes ({notes.length})</h2>
                {notes.length > 0 ? (
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
                                            onDelete={deleteNote}
                                            onView={viewNote}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <p className="text-gray-500 dark:text-gray-400">No notes have been uploaded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherView;