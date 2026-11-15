# 🌾 Agro Frotas

Aplicativo multiplataforma (iOS, Android e Web) para gerenciamento de frotas e controle
preventivo/corretivo de máquinas agrícolas. Feito com **Expo SDK 58**, **Expo Router**,
**TypeScript** e **Firebase** (Authentication + Firestore).

## Funcionalidades

- **Login** com e-mail/senha, feedback via toast e logout com confirmação
  (ícone no cabeçalho do Painel e botão **Sair** no menu lateral).
- **Painel**: contadores por status (operando / manutenção / parada) e alertas de revisão próxima.
- **Máquinas**: listagem com `FlatList`, estado vazio, atualização ao focar a tela,
  destaque de revisão a ≤ 50 h (`proximaRevisao - horimetro <= 50`) e alteração rápida de status
  por toque no selo (operando → manutenção → parada → operando).
- **Cadastro/edição** unificado (`/maquinas/cadastro?id=`), com validação e conversão numérica explícita.
- **Detalhe**: histórico de manutenções (mais recentes primeiro) e **custo total** acumulado.
- **Manutenção**: grava na subcoleção e, em **transação atômica**, atualiza o horímetro e a próxima revisão da máquina.
- **Interface web**: menu lateral em telas largas (≥ 900 px) e abas embaixo no celular,
  e-mail do usuário logado no cabeçalho, título da aba do navegador por tela e
  atalhos de teclado na lista de máquinas (**N** = nova máquina, **R** = atualizar).

## Pré-requisitos

- Node.js 20 LTS ou superior
- Conta no [Firebase](https://console.firebase.google.com)
- (Opcional) app **Expo Go** no celular, atualizado para o SDK 58

## Instalação

```bash
npm install
```

## Configuração do Firebase

1. No console do Firebase, crie um projeto.
2. **Authentication → Método de login**: ative **E-mail/senha** e crie um usuário em *Usuários*.
3. **Firestore Database**: crie o banco (ID `(default)`, edição Standard, modo de produção).
4. Em **Regras**, cole o conteúdo de [`firestore.rules`](./firestore.rules) e publique.
5. **Configurações do projeto → Seus apps → Web (`</>`)**: registre um app e copie as chaves.
6. Copie `.env.example` para `.env` e preencha:


> O arquivo `.env` está no `.gitignore` e não deve ser versionado.
> O `.env` só é lido quando o Metro inicia: depois de alterá-lo, reinicie com `npx expo start -c`.

## Execução

```bash
npx expo start
```

Depois pressione `a` (Android), `i` (iOS), `w` (Web) ou leia o QR code com o Expo Go.
Se algo estranho aparecer depois de mexer em arquivos de configuração, limpe o cache com
`npx expo start -c`. Verificação de tipos: `npm run typecheck`.

> No PowerShell do Windows, se o `npx` for bloqueado, rode uma vez:
> `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
> (ou use o Prompt de Comando).

## Estrutura

```
app/
  _layout.tsx            # Providers + guarda de rotas (Stack.Protected)
  +not-found.tsx         # Rota bloqueada/inexistente → login ou painel
  (auth)/
    _layout.tsx
    login.tsx
  (tabs)/
    _layout.tsx          # Navegação: menu lateral (web larga) ou abas (celular)
    index.tsx            # Painel (contadores + alertas)
    maquinas/            # index, cadastro (?id=), detalhe (?id=)
    manutencao/cadastro.tsx
components/              # barra-lateral, header-usuario, maquina-card e ui/ (Button, Input, Card, Toast, ...)
context/auth-context.tsx
hooks/                   # use-maquinas, use-focus-refresh, use-web
lib/                     # tipos, tema, formatação/validação, plataforma, confirmar
services/maquinas.ts     # acesso ao Firestore
firebase.ts              # inicialização do Firebase (Auth + Firestore), na raiz
```

## Modelo de dados

- `maquinas`: `nome`, `tipo`, `modelo?`, `ano?`, `horimetro`, `proximaRevisao`, `status`
- `maquinas/{id}/manutencoes`: `tipo`, `descricao`, `data` (AAAA-MM-DD), `custo`, `horimetron`

> O campo da manutenção chama-se `horimetron` (com "n"), como está no código e no banco.

## Observações sobre o efeito cascata

Ao registrar uma manutenção, o horímetro da máquina passa a ser o maior entre o atual e o
informado (lançamentos retroativos não "voltam" o horímetro). Em manutenções **preventivas**, a
próxima revisão é obrigatória (sugestão: horímetro + 250 h); nas **corretivas** ela é opcional.