import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

// Interface yang sesuai dengan JWT claims dari backend
interface JWTClaims {
  user_id: number;
  email: string;
  exp: number;
}

// Interface user untuk state management
interface User {
  id: number;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  
  setToken: (token: string) => {
    try {
      const decoded = jwtDecode<JWTClaims>(token);
      
      // Mapping dari JWT claims ke User interface
      const user: User = {
        id: decoded.user_id,
        email: decoded.email,
      };
      
      set({ 
        token, 
        user, 
        isAuthenticated: true 
      });
      
      // Simpan token ke cookie (lebih aman dari XSS)
      Cookies.set('auth_token', token, { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
    } catch (error) {
      console.error('Gagal decode token:', error);
      // Jika decode gagal, logout
      get().logout();
    }
  },
  
  logout: () => {
    Cookies.remove('auth_token');
    set({ 
      token: null, 
      user: null, 
      isAuthenticated: false 
    });
  },
  
  // Fungsi untuk initialize auth dari cookie saat app start
  initializeAuth: () => {
    const token = Cookies.get('auth_token');
    if (token) {
      try {
        const decoded = jwtDecode<JWTClaims>(token);
        
        // Cek apakah token sudah expired
        if (decoded.exp * 1000 > Date.now()) {
          const user: User = {
            id: decoded.user_id,
            email: decoded.email,
          };
          
          set({ 
            token, 
            user, 
            isAuthenticated: true 
          });
        } else {
          // Token expired, logout
          get().logout();
        }
      } catch (error) {
        console.error('Token tidak valid:', error);
        get().logout();
      }
    }
  },
}));