import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

/** Título da aba do navegador, atualizado quando a tela recebe foco. */
export function useTituloWeb(titulo: string) {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'web') document.title = `${titulo} | Agro Frotas`;
    }, [titulo]),
  );
}

/** Atalhos de uma tecla (ignora quando o usuário está digitando num campo). */
export function useAtalhos(mapa: Record<string, () => void>) {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const aoTeclar = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(alvo.tagName)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      mapa[e.key]?.();
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [mapa]);
}