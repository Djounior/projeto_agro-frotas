import { useCallback, useMemo, useState } from 'react';
import { useFocusRefresh } from '@/hooks/use-focus-refresh';
import type { Manutencao, Maquina } from '@/lib/types';
import { listarManutencoes, listarMaquinas, obterMaquina } from '@/services/maquinas';

function mensagem(e: unknown): string {
  return e instanceof Error ? e.message : 'Erro inesperado.';
}

export function useMaquinas() {
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    try {
      setErro(null);
      setMaquinas(await listarMaquinas());
    } catch (e) {
      setErro(mensagem(e));
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusRefresh(recarregar);

  return { maquinas, setMaquinas, carregando, erro, recarregar };
}

export function useMaquinaDetalhe(id: string | undefined) {
  const [maquina, setMaquina] = useState<Maquina | null>(null);
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    if (!id) return;
    try {
      setErro(null);
      const [m, lista] = await Promise.all([obterMaquina(id), listarManutencoes(id)]);
      setMaquina(m);
      setManutencoes(lista);
    } catch (e) {
      setErro(mensagem(e));
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useFocusRefresh(recarregar);

  const custoTotal = useMemo(
    () => manutencoes.reduce((soma, m) => soma + m.custo, 0),
    [manutencoes],
  );

  return { maquina, manutencoes, custoTotal, carregando, erro, recarregar };
}
