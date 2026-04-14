import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialSubjects = [
  { id: "CNTT1112_02", name: "Kiến trúc máy tính", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1114_03", name: "Mạng máy tính và truyền số liệu", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1137_02", name: "Phân tích nghiệp vụ", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1165_02", name: "Thiết kế WEB", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1186_02", name: "Công nghệ hiện đại trong CNTT", credits: 3, weights: { attendance: 0.1, midterm: 0.9, final: 0 }, hasFinal: false },
  { id: "LLNL1106_12", name: "Kinh tế chính trị Mác - Lênin", credits: 2, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true }
];

export const useStore = create(
  persist(
    (set, get) => ({
      scores: {}, 
      updateScore: (subjectId, field, value) => set((state) => {
        const currentSubjectScores = state.scores[subjectId] || { attendance: '', midterm: '', final: '' };
        return {
          scores: {
            ...state.scores,
            [subjectId]: {
              ...currentSubjectScores,
              [field]: value
            }
          }
        };
      }),
      clearFinalScores: () => set((state) => {
        const newScores = { ...state.scores };
        Object.keys(newScores).forEach(key => {
          newScores[key] = { ...newScores[key], final: '' };
        });
        return { scores: newScores };
      })
    }),
    {
      name: 'apple-gpa-storage',
      partialize: (state) => {
        const savedScores = {};
        Object.keys(state.scores).forEach(key => {
          savedScores[key] = {
            attendance: state.scores[key].attendance,
            midterm: state.scores[key].midterm,
            final: '' 
          };
        });
        return { scores: savedScores };
      }
    }
  )
);