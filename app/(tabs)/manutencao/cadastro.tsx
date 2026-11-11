import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useMaquinas } from '@/hooks/use-maquinas';
import { dataValida, hojeISO, mascararData, parseNumeroFlex } from '@/lib/format';
import { colors, spacing } from '@/lib/theme';
import { Maquina, TIPOS_MANUTENCAO, TipoManutencao } from '@/lib/types';
import { registrarManutencao } from '@/services/maquinas';

const INTERVALO_PADRAO_REVISAO = 250; // sugestão: próxima revisão preventiva em +250 h

interface Form {
  tipo: TipoManutencao | null;
  descricao: string;
  data: string;
  custo: string;
  horimetron: string;
  proximaRevisao: string;
}

const FORM_VAZIO = (): Form => ({
  tipo: null,
  descricao: '',
  data: hojeISO(),
  custo: '',
  horimetron: '',
  proximaRevisao: '',
});

type Erros = Partial<Record<keyof Form | 'maquina', string>>;

export default function CadastroManutencao() {
  const { maquinaId } = useLocalSearchParams<{ maquinaId?: string }>();
  const router = useRouter();
  const { mostrar } = useToast();
  const { maquinas, carregando } = useMaquinas();

  const [maquina, setMaquina] = useState<Maquina | null>(null);
  const [form, setForm] = useState<Form>(FORM_VAZIO);
  const [erros, setErros] = useState<Erros>({});
  const [salvando, setSalvando] = useState(false);
  const preSelecionou = useRef<string | null>(null);

  const selecionar = useCallback((m: Maquina) => {
    setMaquina(m);
    setForm((f) => ({
      ...f,
      horimetron: String(m.horimetro),
      proximaRevisao: f.tipo === 'preventiva' ? String(m.horimetro + INTERVALO_PADRAO_REVISAO) : '',
    }));
    setErros((e) => ({ ...e, maquina: undefined }));
  }, []);

  // Pré-seleciona a máquina vinda da tela de detalhes (?maquinaId=).
  useEffect(() => {
    if (!maquinaId || preSelecionou.current === maquinaId) return;
    const m = maquinas.find((x) => x.id === maquinaId);
    if (m) {
      preSelecionou.current = maquinaId;
      selecionar(m);
    }
  }, [maquinaId, maquinas, selecionar]);

  const atualizar = <K extends keyof Form>(campo: K, valor: Form[K]) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  function escolherTipo(t: TipoManutencao) {
    setForm((f) => ({
      ...f,
      tipo: t,
      proximaRevisao:
        t === 'preventiva' && maquina && f.proximaRevisao === ''
          ? String(maquina.horimetro + INTERVALO_PADRAO_REVISAO)
          : f.proximaRevisao,
    }));
    setErros((e) => ({ ...e, tipo: undefined }));
  }

  async function salvar() {
    const e: Erros = {};
    if (!maquina) e.maquina = 'Selecione a máquina.';
    if (!form.tipo) e.tipo = 'Selecione o tipo.';
    if (!form.descricao.trim()) e.descricao = 'Descreva o serviço executado.';
    if (!dataValida(form.data)) e.data = 'Use o formato AAAA-MM-DD com uma data válida.';

    const custo = parseNumeroFlex(form.custo);
    if (custo === null || custo < 0) e.custo = 'Informe um custo válido (R$).';

    const horimetron = parseNumeroFlex(form.horimetron);
    if (horimetron === null || horimetron < 0) e.horimetron = 'Informe o horímetro da intervenção.';

    let proxima: number | undefined;
    if (form.proximaRevisao.trim() !== '') {
      const n = parseNumeroFlex(form.proximaRevisao);
      if (n === null || (horimetron !== null && n <= horimetron)) {
        e.proximaRevisao = 'Deve ser maior que o horímetro da intervenção.';
      } else {
        proxima = n;
      }
    } else if (form.tipo === 'preventiva') {
      e.proximaRevisao = 'Defina a próxima revisão após uma preventiva.';
    }

    setErros(e);
    if (Object.keys(e).length > 0 || !maquina || !form.tipo || custo === null || horimetron === null) {
      mostrar('Corrija os campos destacados.', 'erro');
      return;
    }

    setSalvando(true);
    try {
      await registrarManutencao(
        maquina.id,
        {
          tipo: form.tipo,
          descricao: form.descricao.trim(),
          data: form.data,
          custo,
          horimetron,
        },
        proxima,
      );
      mostrar('Manutenção registrada e máquina atualizada!', 'sucesso');
      const id = maquina.id;
      setForm(FORM_VAZIO());
      setMaquina(null);
      setErros({});
      preSelecionou.current = null;
      router.replace(`/maquinas/detalhe?id=${id}`);
    } catch {
      mostrar('Erro ao registrar a manutenção. Tente novamente.', 'erro');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (maquinas.length === 0) {
    return (
      <EmptyState
        icone="construct-outline"
        titulo="Cadastre uma máquina primeiro"
        descricao="É preciso ter ao menos uma máquina para registrar manutenções."
      />
    );
  }

  const rotulosMaquinas = Object.fromEntries(maquinas.map((m) => [m.id, m.nome]));

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <ChipSelect
          rotulo="Máquina"
          obrigatorio
          opcoes={maquinas.map((m) => m.id)}
          valor={maquina?.id ?? null}
          onChange={(id) => {
            const m = maquinas.find((x) => x.id === id);
            if (m) selecionar(m);
          }}
          rotulos={rotulosMaquinas}
          erro={erros.maquina}
        />
        <ChipSelect
          rotulo="Tipo de manutenção"
          obrigatorio
          opcoes={TIPOS_MANUTENCAO}
          valor={form.tipo}
          onChange={escolherTipo}
          rotulos={{ preventiva: 'Preventiva', corretiva: 'Corretiva' }}
          erro={erros.tipo}
        />
        <Input
          rotulo="Descrição do serviço"
          obrigatorio
          value={form.descricao}
          onChangeText={(v) => atualizar('descricao', v)}
          multiline
          numberOfLines={3}
          style={{ minHeight: 90, textAlignVertical: 'top', paddingTop: 12 }}
          placeholder="Ex.: Troca de óleo e filtros"
          erro={erros.descricao}
        />
        <Input
          rotulo="Data (AAAA-MM-DD)"
          obrigatorio
          value={form.data}
          onChangeText={(v) => atualizar('data', mascararData(v))}
          keyboardType="numeric"
          maxLength={10}
          placeholder="2026-11-10"
          erro={erros.data}
        />
        <Input
          rotulo="Custo (R$)"
          obrigatorio
          value={form.custo}
          onChangeText={(v) => atualizar('custo', v)}
          keyboardType="decimal-pad"
          placeholder="Ex.: 850.50"
          erro={erros.custo}
        />
        <Input
          rotulo="Horímetro na intervenção (h)"
          obrigatorio
          value={form.horimetron}
          onChangeText={(v) => atualizar('horimetron', v)}
          keyboardType="decimal-pad"
          erro={erros.horimetron}
        />
        <Input
          rotulo={form.tipo === 'preventiva' ? 'Próxima revisão (h)' : 'Próxima revisão (h) — opcional'}
          obrigatorio={form.tipo === 'preventiva'}
          value={form.proximaRevisao}
          onChangeText={(v) => atualizar('proximaRevisao', v)}
          keyboardType="decimal-pad"
          erro={erros.proximaRevisao}
        />
        <Text style={styles.dica}>
          Ao salvar, o horímetro atual da máquina será atualizado para o valor informado
          {form.proximaRevisao.trim() ? ' e a próxima revisão será redefinida.' : '.'}
        </Text>
        <Button titulo="Registrar manutenção" onPress={salvar} carregando={salvando} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  conteudo: { padding: spacing.md, paddingBottom: spacing.xl, width: '100%', maxWidth: 640, alignSelf: 'center' },
  dica: { color: colors.muted, fontSize: 13, marginBottom: spacing.md },
});
