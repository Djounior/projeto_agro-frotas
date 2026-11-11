# 🌾 Agro Frotas

Aplicativo multiplataforma (iOS, Android e Web) para gerenciamento de frotas e controle
preventivo/corretivo de máquinas agrícolas. Feito com **Expo SDK 54**, **Expo Router**,
**TypeScript** e **Firebase** (Authentication + Firestore).

## Funcionalidades

- **Login** com e-mail/senha, feedback via toast e logout imediato (ícone no cabeçalho do Painel).
- **Painel**: contadores por status (operando / manutenção / parada) e alertas de revisão próxima.
- **Máquinas**: listagem com `FlatList`, estado vazio, atualização ao focar a tela,
  destaque de revisão a ≤ 50 h (`proximaRevisao - horimetro <= 50`) e alteração rápida de status
  por toque no selo (operando → manutenção → parada → operando).
- **Cadastro/edição** unificado (`/maquinas/cadastro?id=`), com validação e conversão numérica explícita.
- **Detalhe**: histórico de manutenções (mais recentes primeiro) e **custo total** acumulado.
- **Manutenção**: grava na subcoleção e, em **transação atômica**, atualiza o horímetro e a próxima revisão da máquina.

## Pré-requisitos

- Node.js 20 LTS ou superior
- Conta no [Firebase](https://console.firebase.google.com)
- (Opcional) app **Expo Go** no celular, atualizado para o SDK 54

## Instalação

```bash
npm install
```

## Configuração do Firebase

1. No console do Firebase, crie um projeto.
2. **Authentication → Sign-in method**: ative **E-mail/senha** e crie um usuário em *Users*.
3. **Firestore Database**: crie o banco (modo produção).
4. Em **Regras**, cole o conteúdo de [`firestore.rules`](./firestore.rules) e publique.
5. **Configurações do projeto → Seus apps → Web (`</>`)**: registre um app e copie as chaves.
6. Copie `.env.example` para `.env` e preencha:

```bash
cp .env.example .env
```

```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

> O arquivo `.env` está no `.gitignore` e não deve ser versionado.

## Execução

```bash
npx expo start
```

Depois pressione `a` (Android), `i` (iOS), `w` (Web) ou leia o QR code com o Expo Go.
Verificação de tipos: `npm run typecheck`.

## Estrutura

```
app/
  _layout.tsx            # Providers + guarda de rotas (login/painel)
  (auth)/login.tsx
  (tabs)/
    _layout.tsx          # Abas, ícones e tema
    index.tsx            # Painel (contadores + alertas)
    maquinas/            # index, cadastro (?id=), detalhe (?id=)
    manutencao/cadastro.tsx
components/              # MaquinaCard e ui/ (Button, Input, Card, Toast, ...)
context/auth-context.tsx
hooks/                   # use-maquinas, use-focus-refresh
lib/                     # tipos, tema, formatação/validação
services/                # firebase.ts e maquinas.ts (acesso ao Firestore)
```

## Modelo de dados

- `maquinas`: `nome`, `tipo`, `modelo?`, `ano?`, `horimetro`, `proximaRevisao`, `status`
- `maquinas/{id}/manutencoes`: `tipo`, `descricao`, `data` (AAAA-MM-DD), `custo`, `horimetron`

## Observações sobre o efeito cascata

Ao registrar uma manutenção, o horímetro da máquina passa a ser o maior entre o atual e o
informado (lançamentos retroativos não "voltam" o horímetro). Em manutenções **preventivas**, a
próxima revisão é obrigatória (sugestão: horímetro + 250 h); nas **corretivas** ela é opcional.
