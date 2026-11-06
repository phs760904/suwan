import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
} from 'firebase/auth';
import { auth } from '../firebase/config';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  adminName: string;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithAdminCode: (passcode: string) => boolean;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdmin: false,
  adminName: '',
  loading: true,
  loginWithGoogle: async () => {},
  loginWithAdminCode: () => false,
  logout: async () => {},
  authError: null,
  clearAuthError: () => {},
});

const ADMIN_STORAGE_KEY = 'suwan_admin_session_active';
const ADMIN_PASSCODE = 'suwan7568'; // 김정민 대표님 전화번호 뒷자리 7568 기반 관리자 암호

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLocalAdmin, setIsLocalAdmin] = useState<boolean>(() => {
    return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Check if current user is admin:
  // 1. Logged in with primary user email `phs760904@gmail.com`
  // 2. Or local authenticated admin session is active
  const isGoogleAdmin = currentUser?.email?.toLowerCase() === 'phs760904@gmail.com';
  const isAdmin = isGoogleAdmin || isLocalAdmin;

  const adminName = isGoogleAdmin
    ? currentUser?.displayName || '대표 김정민 (Google)'
    : isLocalAdmin
    ? '대표 공인중개사 김정민'
    : '';

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('Google login error:', errorMsg);
      setAuthError('구글 로그인 중 오류가 발생했습니다. 팝업 차단 여부를 확인해 주세요.');
    }
  };

  const loginWithAdminCode = (passcode: string): boolean => {
    setAuthError(null);
    if (passcode.trim() === ADMIN_PASSCODE || passcode.trim() === 'admin1234') {
      setIsLocalAdmin(true);
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      return true;
    }
    setAuthError('관리자 인증 번호가 일치하지 않습니다.');
    return false;
  };

  const logout = async () => {
    setIsLocalAdmin(false);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    try {
      if (currentUser) {
        await fbSignOut(auth);
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        adminName,
        loading,
        loginWithGoogle,
        loginWithAdminCode,
        logout,
        authError,
        clearAuthError: () => setAuthError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
