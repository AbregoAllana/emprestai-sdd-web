# Entrega da prática — frontend

O registro coordenado das specs, decisões e evidências está no [ENTREGA.md da API](https://github.com/AbregoAllana/emprestai-sdd-api/blob/codex/pratica-sdd/ENTREGA.md).

- Frontend: https://github.com/AbregoAllana/emprestai-sdd-web
- [Site publicado](https://emprestai-sdd-web.vercel.app/) · [Login](https://emprestai-sdd-web.vercel.app/entrar). A conferência de produção e os pareceres por critério estão no registro coordenado da API.
- Entrada pública: landing em /, login em /entrar e catálogo para sessões autenticadas. Veja a [spec 004](docs/specs/004-entrada-publica/spec.md).
- Verificação local: build, lint e 8 testes aprovados, incluindo foco por teclado na landing, acesso direto ao login e atualização após conflito de empréstimo.
- Em 11/11/2026, a conferência no navegador mostrou a landing sem sessão, login via teclado, catálogo em / e /entrar com sessão e layout da landing em 390 px sem rolagem horizontal. Os três notebooks da conta de teste foram observados em Meus empréstimos e devolvidos pela titular usando a API. A titular confirmou a recusa do quarto pedido pelo limite de três.
