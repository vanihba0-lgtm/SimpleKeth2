import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  // Farmer input
  selectedCrop: string;
  quantity: number;
  location: string;

  // Preferences
  language: "en" | "hi" | "te" | "ta" | "kn" | "mr" | "bn" | "gu" | "pa" | "or";
  smsEnabled: boolean;
  voiceEnabled: boolean;
  pushEnabled: boolean;

  // Actions
  setCrop: (crop: string) => void;
  setQuantity: (qty: number) => void;
  setLocation: (loc: string) => void;
  setLanguage: (lang: "en" | "hi" | "te" | "ta" | "kn" | "mr" | "bn" | "gu" | "pa" | "or") => void;
  setSmsEnabled: (enabled: boolean) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setPushEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedCrop: "wheat",
      quantity: 500,
      location: "Sehore, MP",

      language: "en",
      smsEnabled: true,
      voiceEnabled: false,
      pushEnabled: true,

      setCrop: (crop) => set({ selectedCrop: crop }),
      setQuantity: (qty) => set({ quantity: qty }),
      setLocation: (loc) => set({ location: loc }),
      setLanguage: (lang) => set({ language: lang }),
      setSmsEnabled: (enabled) => set({ smsEnabled: enabled }),
      setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
      setPushEnabled: (enabled) => set({ pushEnabled: enabled }),
    }),
    {
      name: "simpleketh-storage",
    }
  )
);
