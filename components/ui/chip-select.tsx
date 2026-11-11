import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/lib/theme';

interface Props<T extends string> {
  rotulo: string;
  opcoes: readonly T[];
  valor: T | null;
  onChange: (v: T) => void;
  rotulos?: Record<string, string>;
  erro?: string;
  obrigatorio?: boolean;
}

export function ChipSelect<T extends string>({
  rotulo,
  opcoes,
  valor,
  onChange,
  rotulos,
  erro,
  obrigatorio,
}: Props<T>) {
  return (
    <View style={styles.grupo}>
      <Text style={styles.rotulo}>
        {rotulo}
        {obrigatorio ? <Text style={{ color: colors.danger }}> *</Text> : null}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.linha}>
        {opcoes.map((o) => {
          const ativo = o === valor;
          return (
            <Pressable
              key={o}
              onPress={() => onChange(o)}
              style={[styles.chip, ativo && styles.chipAtivo]}
            >
              <Text style={[styles.chipTexto, ativo && { color: '#fff' }]}>{rotulos?.[o] ?? o}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: { marginBottom: spacing.md },
  rotulo: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  linha: { gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipAtivo: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTexto: { color: colors.text, fontWeight: '600' },
  erro: { color: colors.danger, fontSize: 13, marginTop: spacing.xs },
});
