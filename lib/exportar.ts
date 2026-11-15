const celula = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

export function baixarCSV(nomeArquivo: string, linhas: (string | number)[][]) {
  if (typeof document === 'undefined') return;
  // BOM + ";" para o Excel em português abrir acentos e colunas certinhos
  const conteudo = '\uFEFF' + linhas.map((l) => l.map(celula).join(';')).join('\r\n');
  const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeArquivo;
  a.click();
  URL.revokeObjectURL(url);
}