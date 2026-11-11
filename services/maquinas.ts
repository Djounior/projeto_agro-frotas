import {
  addDoc,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import type {
  Manutencao,
  ManutencaoInput,
  Maquina,
  MaquinaInput,
  StatusMaquina,
} from '@/lib/types';

const COLECAO = 'maquinas';

function paraMaquina(id: string, d: Record<string, unknown>): Maquina {
  return {
    id,
    nome: String(d.nome ?? ''),
    tipo: d.tipo as Maquina['tipo'],
    modelo: typeof d.modelo === 'string' ? d.modelo : undefined,
    ano: typeof d.ano === 'number' ? d.ano : undefined,
    horimetro: Number(d.horimetro ?? 0),
    proximaRevisao: Number(d.proximaRevisao ?? 0),
    status: d.status as Maquina['status'],
  };
}

export async function listarMaquinas(): Promise<Maquina[]> {
  const snap = await getDocs(query(collection(db, COLECAO), orderBy('nome')));
  return snap.docs.map((s) => paraMaquina(s.id, s.data()));
}

export async function obterMaquina(id: string): Promise<Maquina | null> {
  const snap = await getDoc(doc(db, COLECAO, id));
  return snap.exists() ? paraMaquina(snap.id, snap.data()) : null;
}

/** Firestore não aceita `undefined`: campos opcionais vazios são omitidos. */
function dadosMaquina(input: MaquinaInput): Record<string, unknown> {
  const dados: Record<string, unknown> = {
    nome: input.nome,
    tipo: input.tipo,
    horimetro: input.horimetro,
    proximaRevisao: input.proximaRevisao,
    status: input.status,
  };
  if (input.modelo) dados.modelo = input.modelo;
  if (input.ano !== undefined) dados.ano = input.ano;
  return dados;
}

export async function criarMaquina(input: MaquinaInput): Promise<string> {
  const ref = await addDoc(collection(db, COLECAO), dadosMaquina(input));
  return ref.id;
}

export async function atualizarMaquina(id: string, input: MaquinaInput): Promise<void> {
  const dados = dadosMaquina(input);
  // Campos opcionais apagados no formulário são removidos do documento.
  if (!input.modelo) dados.modelo = deleteField();
  if (input.ano === undefined) dados.ano = deleteField();
  await updateDoc(doc(db, COLECAO, id), dados);
}

export async function alterarStatus(id: string, status: StatusMaquina): Promise<void> {
  await updateDoc(doc(db, COLECAO, id), { status });
}

export async function listarManutencoes(maquinaId: string): Promise<Manutencao[]> {
  const snap = await getDocs(
    query(collection(db, COLECAO, maquinaId, 'manutencoes'), orderBy('data', 'desc')),
  );
  return snap.docs.map((s) => {
    const d = s.data();
    return {
      id: s.id,
      tipo: d.tipo,
      descricao: String(d.descricao ?? ''),
      data: String(d.data ?? ''),
      custo: Number(d.custo ?? 0),
      horimetron: Number(d.horimetron ?? 0),
    } as Manutencao;
  });
}

/**
 * Efeito cascata (RF03): em uma única transação atômica
 *  1) grava a manutenção na subcoleção;
 *  2) atualiza o horímetro atual da máquina;
 *  3) redefine a próxima revisão (se informada).
 */
export async function registrarManutencao(
  maquinaId: string,
  input: ManutencaoInput,
  novaProximaRevisao?: number,
): Promise<void> {
  const refMaquina = doc(db, COLECAO, maquinaId);
  const refManutencao = doc(collection(db, COLECAO, maquinaId, 'manutencoes'));

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(refMaquina);
    if (!snap.exists()) throw new Error('Máquina não encontrada.');
    const atual = paraMaquina(snap.id, snap.data());

    const atualizacao: Record<string, number> = {};
    // Lançamentos retroativos não podem "voltar" o horímetro da máquina.
    atualizacao.horimetro = Math.max(atual.horimetro, input.horimetron);
    if (novaProximaRevisao !== undefined) {
      atualizacao.proximaRevisao = novaProximaRevisao;
    }

    tx.set(refManutencao, { ...input });
    tx.update(refMaquina, atualizacao);
  });
}
