/** Converte texto digitado (aceita vírgula decimal) em number. Retorna null se inválido. */
export function parseNumero(texto: string): number | null {
  const limpo = texto.trim().replace(/\./g, '').replace(',', '.');
  if (limpo === '') return null;
  const n = Number(limpo);
  return Number.isFinite(n) ? n : null;
}

/** Mesma coisa, mas preserva o ponto como decimal quando não há vírgula (ex.: "1250.5"). */
export function parseNumeroFlex(texto: string): number | null {
  const t = texto.trim();
  if (t === '') return null;
  const normalizado = t.includes(',') ? t.replace(/\./g, '').replace(',', '.') : t;
  const n = Number(normalizado);
  return Number.isFinite(n) ? n : null;
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatarHoras(valor: number): string {
  return `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} h`;
}

/** Valida o formato rígido AAAA-MM-DD e se a data realmente existe. */
export function dataValida(texto: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const [a, m, d] = texto.split('-').map(Number);
  const dt = new Date(a, m - 1, d);
  return dt.getFullYear() === a && dt.getMonth() === m - 1 && dt.getDate() === d;
}

/** Aplica máscara AAAA-MM-DD enquanto o usuário digita. */
export function mascararData(texto: string): string {
  const n = texto.replace(/\D/g, '').slice(0, 8);
  if (n.length <= 4) return n;
  if (n.length <= 6) return `${n.slice(0, 4)}-${n.slice(4)}`;
  return `${n.slice(0, 4)}-${n.slice(4, 6)}-${n.slice(6)}`;
}

export function hojeISO(): string {
  const h = new Date();
  const mm = String(h.getMonth() + 1).padStart(2, '0');
  const dd = String(h.getDate()).padStart(2, '0');
  return `${h.getFullYear()}-${mm}-${dd}`;
}

export function dataBR(iso: string): string {
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
}

/** Regra RF03: revisão próxima quando faltam 50 h ou menos. */
export const LIMITE_ALERTA_HORAS = 50;
export function revisaoProxima(horimetro: number, proximaRevisao: number): boolean {
  return proximaRevisao - horimetro <= LIMITE_ALERTA_HORAS;
}
