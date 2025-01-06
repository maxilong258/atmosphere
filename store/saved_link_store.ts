import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SavedLink {
  name: string;
  url: string;
}

interface SavedLinksState {
  links: SavedLink[];
  addLink: (name: string, url: string) => void;
  removeLink: (index: number) => void;
  clearLinks: () => void;
}

export const useSavedLinks = create<SavedLinksState>()(
  persist(
    (set) => ({
      links: [],
      addLink: (name: string, url: string) =>
        set((state) => ({
          links: [...state.links, { name, url }],
        })),
      removeLink: (index: number) =>
        set((state) => ({
          links: state.links.filter((_, i) => i !== index),
        })),
      clearLinks: () => set({ links: [] }),
    }),
    {
      name: 'saved-links-storage', // localStorage的键名
    }
  )
);