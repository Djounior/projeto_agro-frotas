import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { parseNumeroFlex } from '@/lib/format';
import { colors, spacing } from '@/lib/theme';
import {
  MaquinaInput,
  ROTULO_STATUS,
  ROTULO_TIPO,
  STATUS_MAQUINA,
  StatusMaquina,
  TIPOS_MAQUINA,
  TipoMaquina,
} from '@/lib/types';
import { atualizarMaquina, criarMaquina, obterMaquina } from '@/services/maquinas';

interface Form {
  nome: string;
  tipo: TipoMaquina | null;
  modelo: string;
  ano: string;
  horimetro: string;
  proximaRevisao: string;
  status: StatusMaquina;
}

const FORM_VAZIO: Form = {
  nome: '',
  tipo: null,
  modelo: '',
  ano: '',
  horimetro: '',
  proximaRevisao: '',
  status: 'operando',
};

type Erros = Partial<Record<keyof Form, string>>;

export default function CadastroMaquina() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { mostrar } = useToast();
  const editando = Boolean(id);

  const [form, setForm] = useState<Form>(FORM_VAZIO);
  const [erros, setErros] = useState<Erros>({});
  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!id) {
      setForm(FORM_VAZIO);
      setCarregando(false);
      return;
    }
    let ativo = true;
    (async () => {
      try {
        const m = await obterMaquina(id);
        if (!ativo) return;
        if (!m) {
          mostrar('Máquina não encontrada.', 'erro');
          router.back();
          return;
        }
        setForm({
          nome: m.nome,
          tipo: m.tipo,
          modelo: m.modelo ?? '',
          ano: m.ano !== undefined ? String(m.ano) : '',
          horimetro: String(m.horimetro),
          proximaRevisao: String(m.proximaRevisao),
          status: m.status,
        });
      } catch {
        mostrar('Falha ao carregar a máquina.', 'erro');
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, [id, mostrar, router]);

  const atualizar = <K extends keyof Form>(campo: K, valor: Form[K]) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  /** Valida e converte explicitamente os campos numéricos para `number`. */
  function validar(): MaquinaInput | null {
    const e: Erros = {};
    const nome = form.nome.trim();
    if (!nome) e.nome = 'Informe o nome da máquina.';
    if (!form.tipo) e.tipo = 'Selecione o tipo.';

    const horimetro = parseNumeroFlex(form.horimetro);
    if (horimetro === null || horimetro < 0) e.horimetro = 'Informe um horímetro válido (≥ 0).';

    const proxima = parseNumeroFlex(form.proximaRevisao);
    if (proxima === null || proxima < 0) e.proximaRevisao = 'Informe um horímetro de revisão válido.';

    let ano: number | undefined;
    if (form.ano.trim() !== '') {
      const n = parseNumeroFlex(form.ano);
      const limite = new Date().getFullYear() + 1;
      if (n === null || !Number.isInteger(n) || n < 1900 || n > limite) {
        e.ano = `Ano inválido (1900 a ${limite}).`;
      } else {
        ano = n;
      }
    }

    setErros(e);
    if (Object.keys(e).length > 0 || !form.tipo || horimetro === null || proxima === null) return null;

    return {
      nome,
      tipo: form.tipo,
      modelo: form.modelo.trim() || undefined,
      ano,
      horimetro,
      proximaRevisao: proxima,
      status: form.status,
    };
  }

  async function salvar() {
    const dados = validar();
    if (!dados) {
      mostrar('Corrija os campos destacados.', 'erro');
      return;
    }
    setSalvando(true);
    try {
      if (id) {
        await atualizarMaquina(id, dados);
      } else {
        await criarMaquina(dados);
      }
      mostrar(id ? 'Máquina atualizada!' : 'Máquina cadastrada!', 'sucesso');
      setForm(FORM_VAZIO);
      setErros({});
      if (id) router.replace(`/maquinas/detalhe?id=${id}`);
      else router.replace('/maquinas');
    } catch {
      mostrar('Erro ao salvar. Verifique sua conexão.', 'erro');
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

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Input
          rotulo="Nome"
          obrigatorio
          value={form.nome}
          onChangeText={(v) => atualizar('nome', v)}
          placeholder="Ex.: Trator 01"
          erro={erros.nome}
        />
        <ChipSelect
          rotulo="Tipo"
          obrigatorio
          opcoes={TIPOS_MAQUINA}
          valor={form.tipo}
          onChange={(v) => atualizar('tipo', v)}
          rotulos={ROTULO_TIPO}
          erro={erros.tipo}
        />
        <Input
          rotulo="Modelo"
          value={form.modelo}
          onChangeText={(v) => atualizar('modelo', v)}
          placeholder="Ex.: John Deere 5078E"
        />
        <Input
          rotulo="Ano de fabricação"
          value={form.ano}
          onChangeText={(v) => atualizar('ano', v)}
          keyboardType="numeric"
          placeholder="Ex.: 2019"
          erro={erros.ano}
        />
        <Input
          rotulo="Horímetro atual (h)"
          obrigatorio
          value={form.horimetro}
          onChangeText={(v) => atualizar('horimetro', v)}
          keyboardType="decimal-pad"
          placeholder="Ex.: 1250"
          erro={erros.horimetro}
        />
        <Input
          rotulo="Próxima revisão (horímetro)"
          obrigatorio
          value={form.proximaRevisao}
          onChangeText={(v) => atualizar('proximaRevisao', v)}
          keyboardType="decimal-pad"
          placeholder="Ex.: 1500"
          erro={erros.proximaRevisao}
        />
        <ChipSelect
          rotulo="Status"
          obrigatorio
          opcoes={STATUS_MAQUINA}
          valor={form.status}
          onChange={(v) => atualizar('status', v)}
          rotulos={ROTULO_STATUS}
        />
        <Button titulo={editando ? 'Salvar alterações' : 'Cadastrar máquina'} onPress={salvar} carregando={salvando} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  conteudo: { padding: spacing.md, paddingBottom: spacing.xl, width: '100%', maxWidth: 640, alignSelf: 'center' },
});
