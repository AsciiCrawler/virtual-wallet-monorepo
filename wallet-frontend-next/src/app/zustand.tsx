import { create } from "zustand";

interface IGlobalState {
  document: string;
  setDocument: (text: string) => void;

  email: string;
  setEmail: (text: string) => void;

  name: string;
  setName: (text: string) => void;

  phone: string;
  setPhone: (text: string) => void;
}

export const useGlobalStore = create<IGlobalState>()((set) => ({
  document: "",
  setDocument: (text) => set(() => ({ document: text })),

  email: "",
  setEmail: (text) => set(() => ({ email: text })),

  name: "",
  setName: (text) => set(() => ({ name: text })),

  phone: "",
  setPhone: (text) => set(() => ({ phone: text })),
}));
