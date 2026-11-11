import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaquinaCard } from '@/components/maquina-card';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { useMaquinas } from '@/hooks/use-maquinas';
import { revisaoProxima } from '@/lib/format';
import { colors, spacing } from '@/lib/theme';
import { ROTULO_STATUS, STATUS_MAQUINA, StatusMaquina } from '@/lib/types';

const ICONE: Record<StatusMaquina, keyof typeof Ionicons.glyphMap> = {
  operando: 'checkmark-circle',
  manutencao: 'build',
  parada: 'pause-circle',
};

export default function Painel() {
  const router = useRouter();
  const { maquinas, carregando, erro, recarregar } = useMaquinas();

  const contagem = useMemo(() => {
    const c: Record<StatusMaquina, number> = { operando: 0, manutencao: 0, parada: 0 };
    maquinas.forEach((m) => {
      c[m.status] += 1;
    });
    return c;
  }, [maquinas]);

  const alertas = useMemo(
    () => maquinas.filter((m) => revisaoProxima(m.horimetro, m.proximaRevisao)),
    [maquinas],
  );

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.conteudo}
      refreshControl={<RefreshControl refreshing={false} onRefresh={recarregar} />}
    >
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Text style={styles.secao}>Situação da frota ({maquinas.length})</Text>
      <View style={styles.contadores}>
        {STATUS_MAQUINA.map((s) => (
          <Card key={s} style={[styles.contador, { borderTopColor: colors[s], borderTopWidth: 4 }]}>
            <Ionicons name={ICONE[s]} size={26} color={colors[s]} />
            <Text style={styles.numero}>{contagem[s]}</Text>
            <Text style={styles.rotulo}>{ROTULO_STATUS[s]}</Text>
          </Card>
        ))}
      </View>

      <Text style={styles.secao}>Alertas de revisão ({alertas.length})</Text>
      {alertas.length === 0 ? (
        <Card>
          <EmptyState
            icone="shield-checkmark-outline"
            titulo="Nenhuma revisão próxima"
            descricao="Todas as máquinas estão com mais de 50 h até a próxima revisão."
          />
        </Card>
      ) : (
        <View style={{ gap: spacing.md }}>
          {alertas.map((m) => (
            <MaquinaCard
              key={m.id}
              maquina={m}
              onPress={() => router.push(`/maquinas/detalhe?id=${m.id}`)}
            />
          ))}
        </View>
      )}

      <Pressable style={styles.atalho} onPress={() => router.push('/maquinas/cadastro')}>
        <Ionicons name="add-circle" size={22} color={colors.primary} />
        <Text style={styles.atalhoTexto}>Cadastrar nova máquina</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  conteudo: { padding: spacing.md, gap: spacing.md },
  secao: { fontSize: 17, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  contadores: { flexDirection: 'row', gap: spacing.sm },
  contador: { flex: 1, alignItems: 'center', gap: 4, paddingHorizontal: spacing.sm },
  numero: { fontSize: 30, fontWeight: '800', color: colors.text },
  rotulo: { fontSize: 12, color: colors.muted, fontWeight: '600', textAlign: 'center' },
  erro: { color: colors.danger, fontWeight: '600' },
  atalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  atalhoTexto: { color: colors.primary, fontWeight: '700', fontSize: 15 },
});
