# ADR-002 — Design system do frontend

> A direcao visual vigente esta documentada em [`../layout.md`](../layout.md):
> design system Nocturne, com interface escura e acento teal. Este ADR
> registra a decisao anterior e nao deve ser usado para derivar novos tokens.

- Status: aceito
- Data: 2026-10-01
- Decisao: adotar o design system pink contemporary definido em `docs/layout.md` como fonte visual da SPA.

## Contexto

O emprestAI e uma ferramenta interna operacional. O frontend precisa reproduzir
o layout aprovado sem deixar que os componentes de Tailwind ou shadcn/ui
introduzam uma aparencia generica. Os componentes devem continuar customizaveis
no repositorio e respeitar os estados de catalogo, emprestimos e operacoes.

## Decisoes

### Direcao visual

- Usar uma direcao **professional blue**: neutros claros, azul-marinho para texto e azul institucional para acao e orientacao.
- Usar fundo neutro `#F4F7FB` e superficies brancas `#FFFFFF`.
- Usar Manrope nos pesos 400, 500, 600, 700 e 800.
- Usar a rampa de azul institucional:
  - `--color-accent-100: #EFF6FF`
  - `--color-accent-200: #DBEAFE`
  - `--color-accent-300: #BFDBFE`
  - `--color-accent-500: #2563EB` (base)
  - `--color-accent-700: #1D4ED8`
  - `--color-accent-800: #1E40AF`
  - `--color-accent-900: #172554`
- Usar `accent-500` em foco e detalhes; `accent-700` em botoes primarios e textos de destaque; `accent-800` e `accent-900` em estados de maior peso.
- Usar rosa em superficies apenas como tintas leves. Acoes primarias podem ser preenchidas com `accent-700`, sem transformar a pagina em um bloco rosa.
- Usar azul-marinho `#172033` no texto principal e ardósia `#64748B` nos metadados.
- Usar teal `#247B78` para disponibilidade, azul ardósia `#5B6B84` para empréstimos e âmbar `#9A6500` para manutenção.
- Evitar marrom, bege dominante, preto puro, gradientes chamativos e sombras empilhadas.

Tokens de superficie:

```css
:root {
  --color-bg: #F4F7FB;
  --color-surface: #FFFFFF;
  --color-text: #172033;
  --color-divider: rgba(148, 163, 184, 0.38);
  --color-neutral-900: #172033;
  --color-warm-neutral: #64748B;
  --color-clay: #CBD5E1;
  --color-secondary-700: #247B78;
  --color-slate-700: #5B6B84;
  --color-warning-700: #9A6500;
}
```

O rosa `500` nao deve ser usado como texto pequeno. Para texto, usar `700` ou
mais escuro. A interface deve continuar predominantemente neutra e branca; o
rosa orienta acao, selecao, foco e estado.

Estados semanticos devem ser tokens, nao cores escolhidas diretamente no
markup:

```css
:root {
  --color-status-available-fg: var(--color-accent-700);
  --color-status-available-bg: rgba(220, 161, 161, 0.14);
  --color-status-available-border: rgba(220, 161, 161, 0.45);
  --color-status-loaned-fg: #856A75;
  --color-status-loaned-bg: rgba(191, 175, 164, 0.16);
  --color-status-loaned-border: rgba(191, 175, 164, 0.42);
  --color-status-overdue-fg: var(--color-accent-800);
  --color-status-overdue-bg: rgba(158, 95, 95, 0.13);
  --color-status-overdue-border: rgba(158, 95, 95, 0.45);
  --color-status-maintenance-fg: var(--color-warm-neutral);
  --color-status-maintenance-bg: rgba(148, 127, 111, 0.12);
  --color-status-maintenance-border: rgba(148, 127, 111, 0.35);
}
```

Disponivel usa acento, emprestado usa argila, atraso usa rosa profundo e
manutencao usa taupe. Nenhum estado depende somente da cor: sempre exibir
texto ou icone equivalente.

### Tipografia

- Usar Manrope nos pesos 400, 500, 600, 700 e 800.
- Usar peso 600 em titulos e 400 no corpo.
- Aplicar line-height aproximado de 1.12 em titulos e 1.55 no corpo.
- Manter a escala de tamanhos definida em `docs/layout.md`.
- Usar `letter-spacing: 0` por padrao; reservar `0.08em` a `0.09em` para
  kickers e cabecalhos uppercase.

Escala de referencia: H1 do login 44px; H1 interno e KPI 30px; H2 26px;
modal 20px; painel 17px; card 16.5px; corpo, celula, input e botao entre
13.5px e 14px; nota, metadado e chip entre 12px e 13px; kicker e cabecalho
de tabela entre 11px e 11.5px.

Hierarquia de texto secundario usa opacidade sobre `--color-text`, sem criar
cinzas avulsos: 72% para apoio em paineis, 70% para labels, 62% para corpo de
dialogo, 55% para subtitulos e metadados, 45% para kickers e dicas de KPI e
40% para rodapes.

### Espacamento e forma

- Usar a escala de densidade `2.8`, `5.6`, `8.4`, `11.2`, `16.8` e `22.4px`.
- Usar raios de 8px, 16px e 20px conforme o nivel da superficie; reservar `10px` para botoes, que devem continuar compactos e operacionais.
- Usar `gap` em flex e grid para espacamento entre irmaos.
- Manter controles com 36px de altura e botoes de login com 40px.
- Usar drop shadows curtos e visiveis em cards e paineis, sem borda escura e sem empilhar elevacoes; o nivel base usa `0 5px 12px rgba(125,29,66,0.15)`.
- Usar padding interno de `36px 40px 64px` nas telas internas.
- Usar largura maxima de 1240px no Catalogo, 1000px em Meus emprestimos,
  1320px em Operacoes e 1160px em Equipamentos.
- Usar `repeat(auto-fill, minmax(292px, 1fr))` e gap de 16px no Catalogo.
- Usar largura de 420px e padding de 26px em modais.
- Usar `gap` em flex e grid; nao usar margens para espacamento entre irmaos.
- A marca usa `EMPREST` em peso 700 e `.AI` em `accent-700`, com
  `letter-spacing: 0.02em`; o simbolo e um quadrado de 22px a 26px com borda
  de 1.5px, raio de 6px a 7px e um quadrado interno de 8px a 9px.

### Componentes

- Criar componentes base para botoes, tags, cards, campos, navegacao, tabelas,
  dialogos e toasts.
- API visual obrigatoria: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`,
  `.btn-block`, `.tag`, `.tag-outline`, `.card`, `.card-kicker`, `.card-title`,
  `.field`, `.input`, `.radio`, `.dot`, `.nav`, `.nav-brand`, `.table`,
  `.dialog-backdrop`, `.dialog`, `.dialog-title`, `.dialog-body` e
  `.dialog-actions`.
- Usar Tailwind para composicao e tokens CSS para os valores do design system.
- Usar shadcn/ui como base somente quando o componente puder ser adaptado ao
  layout, sem aceitar seus estilos padrao como contrato visual.
- Usar Phosphor Icons para icones da interface.
- Usar foco visivel com contorno de 2px e offset de 2px.
- Representar estados com texto, cor e borda; nunca depender somente da cor.

Estados de interacao:

- Primario usa contorno de 1px no acento sobre fundo transparente.
- Secundario usa contorno de divider; ghost usa texto em `accent-700`.
- Hover usa tint sutil de `accent-100` a `accent-300`; pressed avanca um nivel.
- Foco usa `outline: 2px solid var(--color-accent-500)` e offset de 2px.
- Botoes e campos mantem dimensoes estaveis durante loading, erro e troca de
  texto.
- Icones sem texto exigem tooltip; usar Phosphor Icons.

Navegacao:

- A barra tem 60px, e sticky, usa `--color-bg` e `z-index: 20`.
- A aba ativa usa borda inferior de 2px em `accent-500`; a inativa usa linha
  transparente e texto com 55% de opacidade.
- A direita ficam papel, avatar, nome e Sair.
- Nao usar modais empilhados; cada acao troca de tela na mesma janela.

Motion:

- Cards entram com `fadeUp .25s ease both`, modais com `.18s` e toasts com
  `.2s`.
- Nao animar KPI, tabela ou navegacao; nao usar parallax, pulsacao ou escala.

### Responsividade e acessibilidade

- Implementar as grades e larguras maximas descritas em `docs/layout.md`.
- Garantir que catalogo, formularios, tabelas e dialogos funcionem em telas
  estreitas sem sobreposicao ou perda de acao principal.
- Manter navegacao por teclado, labels associados e estados de erro acessiveis.
- Garantir que texto, estado e acao sejam compreensiveis sem depender de cor.
- Em telas estreitas, tabelas podem rolar horizontalmente, mas a acao principal
  deve continuar identificavel.
- Validar os fluxos principais com Playwright e os componentes com testes focados.

## Consequencias

- O layout.md continua sendo a especificacao visual detalhada; este ADR registra
  as decisoes que devem permanecer estaveis durante a implementacao.
- Componentes copiados do shadcn/ui exigem customizacao local e revisao visual.
- Alteracoes de tokens ou tipografia devem atualizar este ADR e ser verificadas
  nas telas de Login, Catalogo, Meus emprestimos e Operacoes.
- O `layout.md` continua sendo a especificacao de composicao das telas, textos,
  fluxos de negocio e dados de exemplo; este ADR concentra o que deve ser
  reutilizado entre elas.
- Acessibilidade e responsividade fazem parte do criterio de pronto, junto com
  os testes funcionais definidos em `docs/rules/tests.md`.

## Referencias

- `docs/layout.md`
- `docs/stack.md`
- `docs/PRD.md`