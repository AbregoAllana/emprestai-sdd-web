# Spec: Catálogo inicial do emprestAI

## Objetivo

Criar a primeira tela interna exibida depois da autenticação: o Catálogo de equipamentos. A tela será uma demonstração funcional, sem login, backend ou persistência, usando os dados mockados definidos em `docs/layout.md`.

## Escopo

- Navegação interna para os papéis Colaborador e Operações.
- Busca por nome e patrimônio.
- Filtros exclusivos por situação.
- Cards de equipamentos com disponibilidade, empréstimo e manutenção.
- Solicitação local de um equipamento disponível, com confirmação e prazo de 14 dias.
- Estados visuais de carregamento, vazio, erro e conteúdo preenchido.
- Responsividade e acessibilidade para teclado, foco e leitores de tela.

Fora do escopo: login, Supabase, API, cliente orval, persistência, operações completas, cadastro de equipamentos e telas completas de empréstimos.

## Dados e regras

- Usuária mockada: Ana Ribeiro, iniciais AR.
- Data de referência: 31/08/2026.
- Máximo de 3 itens por pessoa.
- Item em atraso bloqueia novas solicitações.
- Equipamento em manutenção nunca é disponível.
- Prazo padrão: 14 dias.

## Critérios de aceite

- CA-01: a aplicação abre diretamente no Catálogo, sem tela de login.
- CA-02: a navegação mostra as abas previstas para o papel Operações e destaca Catálogo.
- CA-03: busca e filtros atualizam os cards sem recarregar a página.
- CA-04: estados de situação não dependem apenas de cor e exibem texto compreensível.
- CA-05: item disponível abre diálogo acessível, confirma a solicitação e exibe toast.
- CA-06: itens em manutenção, emprestados, em posse da usuária ou bloqueados ficam indisponíveis para solicitação.
- CA-07: layout e controles permanecem utilizáveis em desktop e mobile, com foco visível.
- CA-08: build, lint e testes do frontend passam sem conexão com o backend.

## Comandos

```bash
npm install
npm run dev
npm run test
npm run build
npm run lint
```

## Limites técnicos

- TypeScript em modo strict.
- React + Vite.
- Tailwind CSS e tokens CSS locais conforme `docs/layout.md` e `docs/adr/002-design-system.md`.
- Phosphor Icons para ícones.
- Estado local nesta primeira entrega; TanStack Query e cliente gerado entram somente com a API.