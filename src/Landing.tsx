import { ArrowRight } from '@phosphor-icons/react'

export function Landing() {
  return (
    <div className="landing">
      <header className="landing-header">
        <a className="brand" href="/" aria-label="emprestAI">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>EMPREST<span className="brand-accent">.AI</span></span>
        </a>
      </header>
      <main className="landing-main">
        <section className="login-copy" aria-labelledby="landing-title">
          <span className="page-kicker">Inventário interno · TI</span>
          <h1 id="landing-title">Empréstimo de equipamentos sem planilha</h1>
          <p>Consulte o catálogo de TI, solicite um equipamento disponível e acompanhe o prazo de devolução dos seus empréstimos.</p>
          <a className="btn btn-primary landing-cta" href="/entrar">
            Entrar <ArrowRight size={16} aria-hidden="true" />
          </a>
        </section>
        <section className="card landing-guide" aria-labelledby="landing-guide">
          <h2 id="landing-guide">Como funciona</h2>
          <ol>
            <li>Entre com seu e-mail corporativo.</li>
            <li>Escolha um equipamento disponível no catálogo.</li>
            <li>Confira o vencimento em Meus empréstimos.</li>
          </ol>
        </section>
      </main>
    </div>
  )
}
