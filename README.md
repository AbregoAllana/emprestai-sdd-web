# emprestAI_frontend

Frontend do **emprestAI** — aplicação web de empréstimo de equipamentos
internos (notebooks, monitores, cabos, câmeras).

Este repositório é a parte **frontend** (SPA) do projeto. A **API** (NestJS)
fica no repositório `emprestAI`. Os dois são repositórios independentes, cada
um com seu projeto na Vercel (ADR-001).

## Stack

- **Linguagem/Build**: TypeScript `strict` · React · Vite
- **Rotas**: React Router (data APIs)
- **Estado**: TanStack Query (servidor) · Zustand (cliente)
- **Formulários**: React Hook Form + `zodResolver`
- **UI**: Tailwind CSS · shadcn/ui
- **API**: cliente gerado do `openapi.json` com orval
- **Testes**: Vitest (unit) · Playwright (E2E)
- **Deploy**: Vercel

Mais detalhes em [docs/stack.md](docs/stack.md).

## Como rodar

Pré-requisitos: Node.js LTS.

```bash
npm install
cp .env.example .env   # preencha os valores (ver .env.example)
npm run dev
```

> O frontend exige a API rodando (repo `emprestAI`) e uma sessão Supabase;
> não há fallback de dados mockados.

## Deploy na Vercel

O projeto usa o preset **Vite**, com `npm run build` como comando de build e
`dist` como diretório de saída. O arquivo [`vercel.json`](vercel.json) mantém
as rotas da SPA funcionando quando uma URL é aberta diretamente.

O domínio de produção configurado para este projeto é
[`https://emprestaifrontend.vercel.app/`](https://emprestaifrontend.vercel.app/).
Depois de cada alteração na branch `main`, a Vercel deve criar um novo
deployment a partir do commit publicado.

Na Vercel, configure `VITE_API_URL` com a URL pública da API em produção. As
variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` também precisam ser
configuradas no ambiente de produção. A API deve liberar a origem exata do
domínio Vercel do frontend via CORS.

## Documentação

- [PRD — visão do produto](docs/PRD.md)
- [Layout — especificação visual (design system e telas)](docs/layout.md)
- [Stack do frontend](docs/stack.md)

## Recurso de referência

- **API (backend)**: repositório `emprestAI` — NestJS + Supabase + Prisma,
  deploy na Vercel. É a fonte do `openapi.json` usado para gerar o cliente.
