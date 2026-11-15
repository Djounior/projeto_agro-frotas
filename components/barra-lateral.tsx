import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/lib/theme';

interface PropsIcone {
  focused: boolean;
  color: string;
  size: number;
}

export interface BarraLateralProps {
  state: { index: number; routes: { key: string; name: string }[] };
  descriptors: Record<
    string,
    { options: { title?: string; tabBarIcon?: (p: PropsIcone) => ReactNode } }
  >;
}

const hover = (s: unknown) => !!(s as { hovered?: boolean }).hovered;

export function BarraLateral({ state, descriptors }: BarraLateralProps) {
  const router = useRouter();

  return (
    <View style={styles.barra}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const ativo = state.index === index;
        const titulo = options.title ?? route.name;
        const cor = ativo ? '#fff' : '#B9D0BF';

        // "index" é o Painel ("/"); as outras abas seguem o nome da pasta.
        const caminho = route.name === 'index' ? '/' : `/${route.name}`;

        return (
          <Pressable
            key={route.key}
            onPress={() => {
              if (!ativo) router.navigate(caminho as never);
            }}
            style={(s) => [styles.item, ativo && styles.itemAtivo, !ativo && hover(s) && styles.itemHover]}
          >
            {options.tabBarIcon?.({ focused: ativo, color: cor, size: 20 })}
            <Text style={[styles.texto, { color: cor }]} numberOfLines={1}>
              {titulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    width: 190,
    backgroundColor: colors.primary,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  itemAtivo: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderColor: 'rgba(255,255,255,0.7)',
  },
  itemHover: { backgroundColor: 'rgba(255,255,255,0.08)' },
  texto: { fontWeight: '700', fontSize: 15, flexShrink: 1 },
});