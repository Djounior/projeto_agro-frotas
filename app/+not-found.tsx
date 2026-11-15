import { Redirect } from 'expo-router';
import { useAuth } from '@/context/auth-context';

/** Rota bloqueada ou inexistente: leva para o Painel (logado) ou para o login (deslogado). */
export default function NaoEncontrado() {
  const { usuario } = useAuth();
  return <Redirect href={usuario ? '/' : '/login'} />;
}