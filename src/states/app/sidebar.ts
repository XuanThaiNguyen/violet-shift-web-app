import { create } from "zustand";

interface SidebarStore {
  isOpen: boolean;
  toggleSidebar: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: window.innerWidth > 768 ? true : false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export default useSidebarStore;