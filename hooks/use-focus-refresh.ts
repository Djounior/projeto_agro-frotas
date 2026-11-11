import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

/** Executa `recarregar` toda vez que a tela recebe foco. */
export function useFocusRefresh(recarregar: () => void | Promise<void>): void {
  useFocusEffect(
    useCallback(() => {
      void recarregar();
    }, [recarregar]),
  );
}
