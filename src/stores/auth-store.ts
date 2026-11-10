import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'SUPER_ADMIN' | 'ADMIN' | 'ORGANIZER' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatar: string | null;
  department: string | null;
  universityId: string | null;
  streakCount: number;
  hasPaidWorkspace?: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      
      setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
      
      setAccessToken: (accessToken) => set({ accessToken }),
      
      updateUser: (updatedUser) => set((state) => ({ 
        user: state.user ? { ...state.user, ...updatedUser } : null 
      })),
      
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'eventhub-auth',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }), // Don't persist access token in localStorage for security (rely on refresh token)
    }
  )
);
