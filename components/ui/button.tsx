import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '@/lib/theme';

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'perigo';
  carregando?: boolean;
  desabilitado?: boolean;
}

export function Button({ titulo, onPress, variante = 'primario', carregando, desabilitado }: Props) {
  const inativo = carregando || desabilitado;
  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      style={({ pressed }) => [
        styles.base,
        variante === 'primario' && { backgroundColor: colors.primary },
        variante === 'perigo' && { backgroundColor: colors.danger },
        variante === 'secundario' && styles.secundario,
        (pressed || inativo) && { opacity: 0.7 },
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={variante === 'secundario' ? colors.primary : '#fff'} />
      ) : (
        <Text style={[styles.texto, variante === 'secundario' && { color: colors.primary }]}>
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  secundario: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  texto: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
