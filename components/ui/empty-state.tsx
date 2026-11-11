import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/lib/theme';

interface Props {
  icone: keyof typeof Ionicons.glyphMap;
  titulo: string;
  descricao?: string;
}

export function EmptyState({ icone, titulo, descricao }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icone} size={56} color={colors.border} />
      <Text style={styles.titulo}>{titulo}</Text>
      {descricao ? <Text style={styles.descricao}>{descricao}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: spacing.xl, gap: spacing.sm },
  titulo: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
  descricao: { fontSize: 14, color: colors.muted, textAlign: 'center' },
});
