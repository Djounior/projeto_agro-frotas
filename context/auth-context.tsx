import { onAuthStateChanged, signOut as fbSignOut, User } from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from '@/services/firebase';

interface AuthValue {
  usuario: User | null;
  carregando: boolean;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthValue>({
  usuario: null,
  carregando: true,
  sair: async () => undefined,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUsuario(u);
      setCarregando(false);
    });
  }, []);

  const sair = async () => {
    await fbSignOut(auth);
  };

  return <AuthContext.Provider value={{ usuario, carregando, sair }}>{children}</AuthContext.Provider>;
}
