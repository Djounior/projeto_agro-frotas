import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatarHoras, revisaoProxima } from '@/lib/format';
import { colors, spacing } from '@/lib/theme';
import { Maquina, ROTULO_TIPO } from '@/lib/types';

interface Props {
  maquina: Maquina;
  onPress?: () => void;
  onAlternarStatus?: () => void;
}

const ICONE_TIPO: Record<Maquina['tipo'], keyof typeof Ionicons.glyphMap> = {
  trator: 'construct',
  colheitadeira: 'leaf',
  pulverizador: 'water',
  implemento: 'build',
};

export function MaquinaCard({ maquina, onPress, onAlternarStatus }: Props) {
  const alerta = revisaoProxima(maquina.horimetro, maquina.proximaRevisao);
  const faltam = maquina.proximaRevisao - maquina.horimetro;

  return (
    <Pressable onPress={onPress}>
      <Card style={alerta ? styles.alerta : undefined}>
        <View style={styles.topo}>
          <View style={styles.icone}>
            <Ionicons name={ICONE_TIPO[maquina.tipo]} size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nome}>{maquina.nome}</Text>
            <Text style={styles.sub}>
              {ROTULO_TIPO[maquina.tipo]}
              {maquina.modelo ? ` • ${maquina.modelo}` : ''}
            </Text>
          </View>
          <StatusBadge status={maquina.status} onPress={onAlternarStatus} />
        </View>

        <View style={styles.linha}>
          <Text style={styles.info}>Horímetro: {formatarHoras(maquina.horimetro)}</Text>
          <Text style={styles.info}>Revisão: {formatarHoras(maquina.proximaRevisao)}</Text>
        </View>

        {alerta ? (
          <View style={styles.faixaAlerta}>
            <Ionicons name="warning" size={16} color="#7A5300" />
            <Text style={styles.textoAlerta}>
              {faltam <= 0
                ? `Revisão vencida há ${formatarHoras(Math.abs(faltam))}`
                : `Revisão em ${formatarHoras(faltam)}`}
            </Text>
          </View>
        ) : null}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  alerta: { borderColor: colors.warning, borderWidth: 2 },
  topo: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nome: { fontSize: 17, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, color: colors.muted },
  linha: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  info: { fontSize: 14, color: colors.text },
  faixaAlerta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    backgroundColor: '#FFF3D1',
    padding: spacing.sm,
    borderRadius: 8,
  },
  textoAlerta: { color: '#7A5300', fontWeight: '700', fontSize: 13 },
});
