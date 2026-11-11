import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '@/lib/theme';
import { ROTULO_STATUS, StatusMaquina } from '@/lib/types';

interface Props {
  status: StatusMaquina;
  /** Quando informado, o badge vira um controle de toque que alterna o status. */
  onPress?: () => void;
}

export function StatusBadge({ status, onPress }: Props) {
  const cor = colors[status];
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      hitSlop={8}
      style={[styles.badge, { backgroundColor: cor + '22', borderColor: cor }]}
    >
      <Text style={[styles.texto, { color: cor }]}>{ROTULO_STATUS[status]}</Text>
      {onPress ? <Ionicons name="swap-horizontal" size={14} color={cor} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  texto: { fontSize: 13, fontWeight: '700' },
});
