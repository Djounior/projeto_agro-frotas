import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { useMaquinaDetalhe } from '@/hooks/use-maquinas';
import { dataBR, formatarHoras, formatarMoeda, revisaoProxima } from '@/lib/format';
import { colors, spacing } from '@/lib/theme';
import { Manutencao, ROTULO_TIPO } from '@/lib/types';

export default function DetalheMaquina() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { maquina, manutencoes, custoTotal, carregando, erro } = useMaquinaDetalhe(id);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!maquina) {
    return <EmptyState icone="alert-circle-outline" titulo="Máquina não encontrada" descricao={erro ?? undefined} />;
  }

  const alerta = revisaoProxima(maquina.horimetro, maquina.proximaRevisao);

  const cabecalho = (
    <View style={{ gap: spacing.md, marginBottom: spacing.md }}>
      <Card style={alerta ? { borderColor: colors.warning, borderWidth: 2 } : undefined}>
        <View style={styles.linhaTopo}>
          <View style={{ flex: 1 }}>
            <Text style={styles.nome}>{maquina.nome}</Text>
            <Text style={styles.sub}>
              {ROTULO_TIPO[maquina.tipo]}
              {maquina.modelo ? ` • ${maquina.modelo}` : ''}
              {maquina.ano ? ` • ${maquina.ano}` : ''}
            </Text>
          </View>
          <StatusBadge status={maquina.status} />
        </View>
        <View style={styles.metricas}>
          <View>
            <Text style={styles.rotulo}>Horímetro atual</Text>
            <Text style={styles.valor}>{formatarHoras(maquina.horimetro)}</Text>
          </View>
          <View>
            <Text style={styles.rotulo}>Próxima revisão</Text>
            <Text style={[styles.valor, alerta && { color: colors.danger }]}>
              {formatarHoras(maquina.proximaRevisao)}
            </Text>
          </View>
        </View>
        {alerta ? (
          <View style={styles.alerta}>
            <Ionicons name="warning" size={16} color="#7A5300" />
            <Text style={styles.alertaTexto}>Revisão próxima ou vencida</Text>
          </View>
        ) : null}
      </Card>

      <Card style={styles.custo}>
        <Ionicons name="cash-outline" size={28} color={colors.primary} />
        <View>
          <Text style={styles.rotulo}>Custo total de manutenções</Text>
          <Text style={styles.custoValor}>{formatarMoeda(custoTotal)}</Text>
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View style={{ flex: 1 }}>
          <Button titulo="Nova manutenção" onPress={() => router.push(`/manutencao/cadastro?maquinaId=${maquina.id}`)} />
        </View>
        <View style={{ flex: 1 }}>
          <Button titulo="Editar" variante="secundario" onPress={() => router.push(`/maquinas/cadastro?id=${maquina.id}`)} />
        </View>
      </View>

      <Text style={styles.secao}>Histórico de manutenções ({manutencoes.length})</Text>
    </View>
  );

  return (
    <FlatList
      data={manutencoes}
      keyExtractor={(m) => m.id}
      contentContainerStyle={styles.lista}
      ListHeaderComponent={cabecalho}
      ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      ListEmptyComponent={
        <EmptyState icone="clipboard-outline" titulo="Sem manutenções registradas" descricao="Registre a primeira manutenção desta máquina." />
      }
      renderItem={({ item }) => <ItemManutencao item={item} />}
    />
  );
}

function ItemManutencao({ item }: { item: Manutencao }) {
  const preventiva = item.tipo === 'preventiva';
  return (
    <Card>
      <View style={styles.linhaTopo}>
        <View style={[styles.tag, { backgroundColor: preventiva ? colors.operando : colors.accent }]}>
          <Text style={styles.tagTexto}>{preventiva ? 'Preventiva' : 'Corretiva'}</Text>
        </View>
        <Text style={styles.data}>{dataBR(item.data)}</Text>
      </View>
      <Text style={styles.descricao}>{item.descricao}</Text>
      <View style={styles.metricas}>
        <Text style={styles.sub}>Horímetro: {formatarHoras(item.horimetron)}</Text>
        <Text style={styles.custoItem}>{formatarMoeda(item.custo)}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lista: { padding: spacing.md, paddingBottom: spacing.xl, width: '100%', maxWidth: 720, alignSelf: 'center' },
  linhaTopo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  nome: { fontSize: 22, fontWeight: '800', color: colors.text },
  sub: { fontSize: 13, color: colors.muted },
  metricas: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  rotulo: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  valor: { fontSize: 20, fontWeight: '800', color: colors.text },
  alerta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    backgroundColor: '#FFF3D1',
    padding: spacing.sm,
    borderRadius: 8,
  },
  alertaTexto: { color: '#7A5300', fontWeight: '700' },
  custo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  custoValor: { fontSize: 24, fontWeight: '800', color: colors.primary },
  secao: { fontSize: 17, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagTexto: { color: '#fff', fontWeight: '700', fontSize: 12 },
  data: { color: colors.muted, fontWeight: '600' },
  descricao: { color: colors.text, fontSize: 15, marginTop: spacing.sm },
  custoItem: { fontWeight: '800', color: colors.text },
});
