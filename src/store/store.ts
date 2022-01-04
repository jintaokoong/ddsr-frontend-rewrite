import create from "zustand";

interface State {
  showing: boolean;
  show: () => void;
  hide: () => void;
}

const useStore = create<State>((set, get) => ({
  showing: false,
  show: () => set((state) => ({ showing: true })),
  hide: () => set((state) => set({ showing: false })),
}));

export default useStore;
