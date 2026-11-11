import { StatusMaquina } from '@/lib/types';

const CICLO: StatusMaquina[] = ['operando', 'manutencao', 'parada'];

/** Ciclo de alternância rápida: operando → manutencao → parada → operando. */
export function proximoStatus(atual: StatusMaquina): StatusMaquina {
  return CICLO[(CICLO.indexOf(atual) + 1) % CICLO.length];
}
