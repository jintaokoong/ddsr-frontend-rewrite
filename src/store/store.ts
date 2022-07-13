import create from "zustand";
import { sleep } from "../utils";

export interface AppState {
  showing: boolean;
  show: () => void;
}

const useStore = create<AppState>((set, get) => ({
  showing: false,
  show: async () => {
    set({ showing: true });
    await sleep(1000);
    set({ showing: false });
  },
}));

export default useStore;
