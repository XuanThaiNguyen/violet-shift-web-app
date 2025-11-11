import { create } from "zustand";

const useRefreshStore = create<{
  map: Record<string, boolean>;
  refresh: (key: string) => void;
}>((set) => ({
  map: {},
  refresh: (key: string) =>
    set((state) => ({ map: { ...state.map, [key]: !state.map[key] } })),
}));

export const useSubscribeRefresh = (key: string) => {
  return useRefreshStore((state) => state.map[key]);
};

export const useRefresh = () => {
  return useRefreshStore((state) => state.refresh);
};
