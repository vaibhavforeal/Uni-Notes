import React, { useState, useMemo } from 'react';
import { UserRole, Note } from './types';
import TeacherView from './components/TeacherView';
import StudentView from './components/StudentView';
import GeminiChat from './components/GeminiChat';
import NoteViewerModal from './components/NoteViewerModal';
import { ChatIcon } from './components/icons/ChatIcon';

const MOCK_NOTES: Note[] = [
    {
        id: '1',
        title: 'Introduction to React Hooks',
        subject: 'Computer Science',
        content: 'This document covers the basics of React Hooks like useState, useEffect, and useContext. It provides code examples and best practices for functional components.',
        fileName: 'react_hooks_intro.txt',
        fileType: 'text',
        uploadedAt: new Date('2023-10-26T10:00:00Z'),
        isBookmarked: true,
        studentNote: 'Review the section on custom hooks for the upcoming project.',
    },
    {
        id: '2',
        title: 'The Renaissance Period',
        subject: 'History',
        content: 'A comprehensive overview of the Renaissance, focusing on its origins in Italy and its impact on art, science, and culture across Europe. Key figures like Leonardo da Vinci and Michelangelo are discussed.',
        fileName: 'renaissance_overview.txt',
        fileType: 'text',
        uploadedAt: new Date('2023-10-25T14:30:00Z'),
        isBookmarked: false,
        studentNote: '',
    },
    {
        id: '3',
        title: 'Quantum Mechanics Fundamentals',
        subject: 'Physics',
        content: 'This note explains the foundational principles of quantum mechanics, including wave-particle duality, superposition, and quantum entanglement. It is intended for undergraduate physics students.',
        fileName: 'quantum_mechanics.txt',
        fileType: 'text',
        uploadedAt: new Date('2023-10-27T09:00:00Z'),
        isBookmarked: false,
        studentNote: 'Important for the final exam. Focus on the double-slit experiment.',
    },
];


export default function App() {
    const [userRole, setUserRole] = useState<UserRole>(UserRole.Student);
    const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    const addNote = (note: Omit<Note, 'id' | 'uploadedAt'>) => {
        const newNote: Note = {
            ...note,
            id: new Date().toISOString(),
            uploadedAt: new Date(),
            isBookmarked: false,
            studentNote: '',
        };
        setNotes(prevNotes => [newNote, ...prevNotes]);
    };

    const deleteNote = (id: string) => {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    };

    const toggleBookmark = (noteId: string) => {
        setNotes(notes.map(n => n.id === noteId ? { ...n, isBookmarked: !n.isBookmarked } : n));
    };

    const updateStudentNote = (noteId: string, text: string) => {
        setNotes(notes.map(n => n.id === noteId ? { ...n, studentNote: text } : n));
        if (selectedNote && selectedNote.id === noteId) {
            setSelectedNote(prev => prev ? { ...prev, studentNote: text } : null);
        }
    };

    const RoleToggleButton = useMemo(() => {
        const inactiveStyle = "px-4 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700";
        const activeStyle = "px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 shadow-sm";

        return (
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button
                    onClick={() => setUserRole(UserRole.Student)}
                    className={userRole === UserRole.Student ? activeStyle : inactiveStyle}
                >
                    Student
                </button>
                <button
                    onClick={() => setUserRole(UserRole.Teacher)}
                    className={userRole === UserRole.Teacher ? activeStyle : inactiveStyle}
                >
                    Teacher
                </button>
            </div>
        );
    }, [userRole]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            College Notes Hub
                        </h1>
                        {RoleToggleButton}
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {userRole === UserRole.Teacher ? (
                    <TeacherView notes={notes} addNote={addNote} deleteNote={deleteNote} viewNote={setSelectedNote} />
                ) : (
                    <StudentView notes={notes} viewNote={setSelectedNote} toggleBookmark={toggleBookmark} />
                )}
            </main>

            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-110"
                aria-label="Open AI Chat"
            >
                <ChatIcon />
            </button>

            <GeminiChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            
            {selectedNote && (
                <NoteViewerModal 
                    note={selectedNote} 
                    onClose={() => setSelectedNote(null)}
                    userRole={userRole}
                    updateStudentNote={updateStudentNote}
                />
            )}
        </div>
    );
}