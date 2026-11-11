# Spec 004 — Entrada pública

A revisão da seção 00 identificou que a cópia individual abre no login ou catálogo e que a apresentação em HTML vive fora da aplicação. A entrada pública apresenta o serviço e encaminha ao login existente.

- CA-01: sem sessão, a raiz mostra a landing pública com um link Entrar para /entrar, sem consultar o inventário.
- CA-02: /entrar abre o formulário existente sem sessão. Com sessão, a raiz e /entrar abrem o catálogo.
- CA-03: a landing funciona por teclado e se adapta à largura da tela. Reutiliza a identidade visual do produto, sem imagens externas.

Fora de escopo: alterações na autenticação, na API, nas fotos de equipamentos ou nos critérios das specs 002 e 003.
