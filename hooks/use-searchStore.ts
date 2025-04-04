// hooks/useSearchStore.ts
import { create } from "zustand";

interface SearchState {
  category: string;
  location: string;
  setCategory: (category: string) => void;
  setLocation: (location: string) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  category: "",
  location: "",
  setCategory: (category) => set({ category }),
  setLocation: (location) => set({ location }),
  reset: () => set({ category: "", location: "" }),
}));
