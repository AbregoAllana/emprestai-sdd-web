# Stack do frontend — decisões (extraído do ADR-001)

> Este documento reúne o que o **ADR-001 — Stack** decide do ponto de vista do
> frontend. O ADR completo e as decisões de backend ficam no repositório da API
> (`emprestAI/docs/adr/001-stack.md`).

## 1. Linguagem e bibliotecas

| Item | Escolha |
|---|---|
| Linguagem | TypeScript em modo `strict` |
| Biblioteca de UI | React |
| Build e dev server | Vite |
| Roteamento | React Router (data APIs) |
| Estado de servidor | TanStack Query |
| Estado de cliente | Zustand |
| Formulários | React Hook Form + `zodResolver` |
| Estilização | Tailwind CSS |
| Componentes | shadcn/ui |
| Cliente da API | Gerado a partir do `openapi.json` com orval |

- **TypeScript `strict`** — sem `strict` o tipo gerado da API não pega os casos
  de nulo, que são exatamente os que quebram em produção.
- **Vite** — o app é uma SPA sem necessidade de renderização no servidor.
- **React Router** — rotas aninhadas e proteção de rota por sessão.
- **TanStack Query** — cache, revalidação, retry e estado de loading sem
  reimplementar em cada tela.
- **Zustand** — o estado que sobra depois do TanStack Query é pouco (UI,
  filtros, wizard).
- **React Hook Form + zodResolver** — o schema Zod vem do mesmo OpenAPI.
- **Tailwind CSS** — o design vem do Figma (`docs/layout.md`) e precisa ser
  reproduzido de perto.
- **shadcn/ui** — componente copiado para dentro do repositório, sem brigar
  com a dependência na hora de customizar.
- **Cliente gerado, não escrito** — cliente HTTP escrito à mão é onde o tipo
  da resposta é reescrito errado.

## 2. Contrato com a API

| Item | Escolha |
|---|---|
| Estilo | REST |
| Fonte do contrato | OpenAPI gerado dos schemas Zod do Nest |
| Distribuição | `openapi.json` publicado como artefato do CI da API |
| Consumo | Front regenera o cliente por script, versionado no repositório |
| Versionamento | Prefixo de rota `/v1` |
| Formato de erro | RFC 9457 (Problem Details) |
| Paginação de listas | Cursor |
| Tempo real | Fora de escopo — Vercel não suporta WebSocket |

- **OpenAPI no lugar de ts-rest** — com repositórios separados não existe
  pacote compartilhado; o contrato atravessa a fronteira como arquivo.
- **Cliente gerado versionado no front** — a mudança de contrato aparece no
  diff do PR, substituto possível para o build quebrar sozinho.
- **RFC 9457** — erro em formato único; o front não lê string de mensagem.
- **Sem tempo real** — atualização de tela é polling do TanStack Query.

## 3. Autenticação (lado do navegador)

| Item | Escolha |
|---|---|
| Provedor de identidade | Supabase Auth, e-mail e senha |
| Cadastro | Fechado, somente por convite de administrador |
| Sessão no navegador | Token no header, gerenciado pelo `supabase-js` |
| Domínio | `https://emprestaifrontend.vercel.app/` |

- **Token no header** — `vercel.app` está na Public Suffix List; cookie
  `httpOnly` não atravessa entre front e API sem domínio próprio.
- **Gerenciado pelo `supabase-js`** — renovação e persistência de sessão já
  resolvidas; o token fica acessível ao JavaScript de qualquer forma.
- **Front nunca fala direto com o Supabase** para dados — isso driblaria a
  autorização por tenant; todo dado passa pela API.

## 4. Testes

| Item | Escolha |
|---|---|
| Unitário no frontend | Vitest |
| E2E de interface | Playwright |

- **Vitest, não Jest** — não exige pipeline de transform paralelo ao do Vite.

## 5. Qualidade de código

| Item | Escolha |
|---|---|
| Lint e formatação | ESLint + Prettier, config replicada nos dois repositórios |
| Hook de pré-commit | lint-staged + husky, apenas lint e formatação |
| Convenção de commit | Nenhuma automação; mensagem escrita pela pessoa |

- **Config replicada** — com repositórios separados não há pacote comum; a
  duplicação é aceita e a divergência é resolvida na revisão.
- **Pré-commit só de lint** — barra o erro trivial antes do CI.

## 6. Consequências para o front

- Mudança de contrato não quebra o build sozinha; depende de regenerar o
  cliente e da checagem no CI.
- Alterar uma feature que toca os dois lados exige dois PRs coordenados em
  repositórios diferentes.
- O token de sessão fica acessível ao JavaScript → qualquer XSS ou dependência
  comprometida vira sequestro de sessão; a CSP é a única barreira.