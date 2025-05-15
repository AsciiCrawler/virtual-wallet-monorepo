import { EventDTO } from "@/types/core.types";
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

  balance: number;
  setBalance: (value: number) => void;

  logged: boolean;
  setLogged: (value: boolean) => void;

  events: EventDTO[];
  setEvents: (value: EventDTO[]) => void;
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

  balance: 0,
  setBalance: (value) => set(() => ({ balance: value })),

  logged: false,
  setLogged: (value) => set(() => ({ logged: value })),

  events: [],
  setEvents: (value) => set(() => ({ events: value })),
}));
