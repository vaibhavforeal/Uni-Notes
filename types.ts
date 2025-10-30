export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student',
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  content: string; // Text content or Base64 Data URL for PDF
  fileType: 'text' | 'pdf';
  fileName: string;
  uploadedAt: Date;
  isBookmarked?: boolean;
  studentNote?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
