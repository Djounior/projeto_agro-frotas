import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, spacing } from '@/lib/theme';

interface Props extends TextInputProps {
  rotulo: string;
  erro?: string;
  obrigatorio?: boolean;
}

export function Input({ rotulo, erro, obrigatorio, style, ...rest }: Props) {
  return (
    <View style={styles.grupo}>
      <Text style={styles.rotulo}>
        {rotulo}
        {obrigatorio ? <Text style={{ color: colors.danger }}> *</Text> : null}
      </Text>
      <TextInput
        placeholderTextColor={colors.muted}
        style={[styles.input, erro ? { borderColor: colors.danger } : null, style]}
        {...rest}
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: { marginBottom: spacing.md },
  rotulo: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    fontSize: 16,
    color: colors.text,
  },
  erro: { color: colors.danger, fontSize: 13, marginTop: spacing.xs },
});
