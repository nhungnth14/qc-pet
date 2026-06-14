import { create } from 'zustand';

export type QuizSessionStatus =
  | 'IDLE'
  | 'IN_PROGRESS'
  | 'SUBMITTING'
  | 'SUBMITTED'
  | 'REWARDING'
  | 'COMPLETE';

export type QuizAnswer = {
  questionIndex: number;
  answer: string;
  isCorrect: boolean;
  timestamp: number;
};

type QuizSessionState = {
  sessionId: string | null;
  lessonId: string | null;
  status: QuizSessionStatus;
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  startSession: (sessionId: string, lessonId: string) => void;
  submitAnswer: (answer: QuizAnswer) => void;
  advanceQuestion: () => void;
  setStatus: (status: QuizSessionStatus) => void;
  resetSession: () => void;
};

export const useQuizSession = create<QuizSessionState>()((set) => ({
  sessionId: null,
  lessonId: null,
  status: 'IDLE',
  currentQuestionIndex: 0,
  answers: [],
  startSession: (sessionId, lessonId) =>
    set({ sessionId, lessonId, status: 'IN_PROGRESS', currentQuestionIndex: 0, answers: [] }),
  submitAnswer: (answer) =>
    set((state) => ({ answers: [...state.answers, answer] })),
  advanceQuestion: () =>
    set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),
  setStatus: (status) => set({ status }),
  resetSession: () =>
    set({ sessionId: null, lessonId: null, status: 'IDLE', currentQuestionIndex: 0, answers: [] }),
}));
