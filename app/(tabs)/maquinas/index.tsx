import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaquinaCard } from '@/components/maquina-card';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/components/ui/toast';
import { useMaquinas } from '@/hooks/use-maquinas';
import { proximoStatus } from '@/lib/status';
import { colors, spacing } from '@/lib/theme';
import { Maquina } from '@/lib/types';
import { alterarStatus } from '@/services/maquinas';

export default function ListaMaquinas() {
  const router = useRouter();
  const { mostrar } = useToast();
  const { maquinas, setMaquinas, carregando, erro, recarregar } = useMaquinas();

  const alternar = useCallback(
    async (m: Maquina) => {
      const novo = proximoStatus(m.status);
      // Atualização otimista; reverte se a gravação falhar.
      setMaquinas((lista) => lista.map((x) => (x.id === m.id ? { ...x, status: novo } : x)));
      try {
        await alterarStatus(m.id, novo);
      } catch {
        setMaquinas((lista) => lista.map((x) => (x.id === m.id ? { ...x, status: m.status } : x)));
        mostrar('Não foi possível alterar o status.', 'erro');
      }
    },
    [setMaquinas, mostrar],
  );

  const renderItem = useCallback(
    ({ item }: { item: Maquina }) => (
      <MaquinaCard
        maquina={item}
        onPress={() => router.push(`/maquinas/detalhe?id=${item.id}`)}
        onAlternarStatus={() => alternar(item)}
      />
    ),
    [router, alternar],
  );

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={maquinas}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        refreshing={false}
        onRefresh={recarregar}
        ListHeaderComponent={erro ? <Text style={styles.erro}>{erro}</Text> : null}
        ListEmptyComponent={
          <EmptyState
            icone="construct-outline"
            titulo="Nenhuma máquina cadastrada"
            descricao="Toque no botão + para cadastrar a primeira máquina da frota."
          />
        }
      />
      <Pressable style={styles.fab} onPress={() => router.push('/maquinas/cadastro')}>
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lista: { padding: spacing.md, paddingBottom: 100, flexGrow: 1 },
  erro: { color: colors.danger, fontWeight: '600', marginBottom: spacing.md },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
});
