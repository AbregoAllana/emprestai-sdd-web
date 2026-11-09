import { FormEvent, useState } from 'react'
import { supabase } from './auth'

export function Login({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    if (!supabase) {
      setError('O ambiente de autenticação não está configurado.')
      setLoading(false)
      return
    }
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) setError('E-mail ou senha inválidos.')
    else onLoggedIn()
    setLoading(false)
  }

  return (
    <main className="login-page">
      <section className="login-intro">
        <a className="brand" href="/" aria-label="emprestAI">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>EMPREST<span className="brand-accent">.AI</span></span>
        </a>
        <div className="login-copy">
          <span className="page-kicker">Operações · TI interno</span>
          <h1>Equipamento certo, no momento certo.</h1>
          <p>Consulte o inventário, acompanhe seus empréstimos e devolva tudo sem planilhas.</p>
        </div>
        <div className="login-stats">
          <span><strong>3</strong><small>itens por pessoa</small></span>
          <span><strong>14</strong><small>dias de prazo</small></span>
          <span><strong>0</strong><small>linhas para preencher</small></span>
        </div>
      </section>
      <section className="login-form-panel" aria-labelledby="login-title">
        <form className="login-form" onSubmit={handleSubmit}>
          <span className="section-kicker">Acesso interno</span>
          <h2 id="login-title">Entrar</h2>
          <p>Use seu e-mail corporativo para acessar o inventário.</p>
          <label className="login-field">E-mail<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
          <label className="login-field">Senha<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>
          {error && <div className="login-error" role="alert">{error}</div>}
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>{loading ? 'Entrando…' : 'Entrar'}</button>
          <small className="login-note">Cada pessoa vê apenas os próprios empréstimos.</small>
        </form>
      </section>
    </main>
  )
}
