export const TIPOS_MAQUINA = ['trator', 'colheitadeira', 'pulverizador', 'implemento'] as const;
export type TipoMaquina = (typeof TIPOS_MAQUINA)[number];

export const STATUS_MAQUINA = ['operando', 'manutencao', 'parada'] as const;
export type StatusMaquina = (typeof STATUS_MAQUINA)[number];

export const TIPOS_MANUTENCAO = ['preventiva', 'corretiva'] as const;
export type TipoManutencao = (typeof TIPOS_MANUTENCAO)[number];

export interface MaquinaInput {
  nome: string;
  tipo: TipoMaquina;
  modelo?: string;
  ano?: number;
  horimetro: number;
  proximaRevisao: number;
  status: StatusMaquina;
}

export interface Maquina extends MaquinaInput {
  id: string;
}

export interface ManutencaoInput {
  tipo: TipoManutencao;
  descricao: string;
  data: string; // AAAA-MM-DD
  custo: number;
  horimetron: number;
}

export interface Manutencao extends ManutencaoInput {
  id: string;
}

export const ROTULO_STATUS: Record<StatusMaquina, string> = {
  operando: 'Operando',
  manutencao: 'Em manutenção',
  parada: 'Parada',
};

export const ROTULO_TIPO: Record<TipoMaquina, string> = {
  trator: 'Trator',
  colheitadeira: 'Colheitadeira',
  pulverizador: 'Pulverizador',
  implemento: 'Implemento',
};
