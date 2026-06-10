import { create } from "zustand";
import type { NewNote } from "../../types/note";
import { persist } from 'zustand/middleware';
type AuthStore = {
  draft: NewNote;
  setDraft: (note: NewNote) => void;
  clearDraft: () => void;
}

const initialDraft = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteDraft = create<AuthStore>()(persist((set) => ({
      draft: initialDraft,
      setDraft: (note) => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: 'note-draft',
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);