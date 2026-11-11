import { Ionicons } from '@expo/vector-icons';
import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '@/lib/theme';

type TipoToast = 'sucesso' | 'erro' | 'info';
interface ToastContextValue {
  mostrar: (mensagem: string, tipo?: TipoToast) => void;
}

const ToastContext = createContext<ToastContextValue>({ mostrar: () => undefined });
export const useToast = () => useContext(ToastContext);

const COR: Record<TipoToast, string> = {
  sucesso: colors.operando,
  erro: colors.danger,
  info: colors.primary,
};
const ICONE: Record<TipoToast, keyof typeof Ionicons.glyphMap> = {
  sucesso: 'checkmark-circle',
  erro: 'alert-circle',
  info: 'information-circle',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const opacidade = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toast, setToast] = useState<{ mensagem: string; tipo: TipoToast } | null>(null);

  const mostrar = useCallback(
    (mensagem: string, tipo: TipoToast = 'info') => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ mensagem, tipo });
      Animated.timing(opacidade, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacidade, { toValue: 0, duration: 250, useNativeDriver: true }).start(
          () => setToast(null),
        );
      }, 3000);
    },
    [opacidade],
  );

  return (
    <ToastContext.Provider value={{ mostrar }}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            { backgroundColor: COR[toast.tipo], top: insets.top + spacing.sm, opacity: opacidade },
          ]}
        >
          <Ionicons name={ICONE[toast.tipo]} size={20} color="#fff" />
          <Text style={styles.texto}>{toast.mensagem}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 999,
  },
  texto: { color: '#fff', fontWeight: '600', flex: 1 },
});
