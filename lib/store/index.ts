import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  username: string;
  isLoggedIn: boolean;
  login: (username: string) => void;
  logout: () => void;
}
//example usage

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        username: "",
        isLoggedIn: false,
        login: (username) => set({ username, isLoggedIn: true }),
        logout: () => set({ username: "", isLoggedIn: false }),
      }),
      {
        name: "code-runner-storage",
      }
    )
  )
);
