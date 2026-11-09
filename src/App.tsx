import { useCallback, useEffect, useMemo, useState } from 'react'
import { Login } from './Login'
import { supabase } from './auth'
import { borrowEquipment, listEquipment, listMyLoans, type OpenLoan } from './api'
import { CatalogHeader, EquipmentCard, FilterBar, LoanDialog, Navigation, StatusState, type Page } from './components'
import { formatDate, type Equipment, type EquipmentStatus, type Filter } from './equipment'

const currentUser = { name: 'Minha conta', initials: 'EU', role: 'Colaborador' }

function CatalogApp() {
  const [page, setPage] = useState<Page>('Catálogo')
  const [items, setItems] = useState<Equipment[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('Todos')
  const [selected, setSelected] = useState<Equipment | null>(null)
  const [dueAt, setDueAt] = useState<string>()
  const [submitting, setSubmitting] = useState(false)
  const [loanError, setLoanError] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    void listEquipment()
      .then((result) => { if (active) setItems(result) })
      .catch(() => { if (active) setError(true) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const availableCount = items.filter((item) => item.status === 'disponivel').length
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    return items.filter((item) => (
      [item.name, item.assetTag].some((value) => value.toLocaleLowerCase('pt-BR').includes(normalizedQuery))
      && (filter === 'Todos' || item.status === filterToStatus(filter))
    ))
  }, [filter, items, query])

  const closeDialog = useCallback(() => { setSelected(null) }, [])

  async function confirmRequest() {
    if (!selected || submitting || dueAt) return
    setSubmitting(true)
    setLoanError('')
    try {
      const loan = await borrowEquipment(selected.id)
      setDueAt(loan.dueAt)
      setItems((previous) => previous.map((item) => item.id === selected.id ? { ...item, status: 'emprestado' } : item))
    } catch (reason: unknown) {
      setLoanError(reason instanceof Error ? reason.message : 'Não foi possível solicitar o equipamento.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo-principal">Ir para o conteúdo principal</a>
      <Navigation currentUser={currentUser} page={page} onNavigate={setPage} onSignOut={() => { void supabase?.auth.signOut() }} />
      <main id="conteudo-principal" className="page-content catalog-page">
        {page === 'Meus empréstimos' ? <MyLoans /> : <>
          <CatalogHeader availableCount={availableCount} totalCount={items.length} query={query} onQueryChange={setQuery} />
          <FilterBar activeFilter={filter} onFilterChange={setFilter} />
          <section className="catalog-section" aria-labelledby="equipment-heading">
            <div className="section-heading">
              <div><span className="section-kicker">Inventário interno</span><h2 id="equipment-heading">Equipamentos para retirada</h2></div>
              <span className="section-count">{filteredItems.length} itens exibidos</span>
            </div>
            {loading ? <StatusState kind="loading" /> : error ? <StatusState kind="error" /> : filteredItems.length > 0 ? (
              <div className="catalog-grid" role="list" aria-label="Catálogo de equipamentos">
                {filteredItems.map((item, index) => <EquipmentCard key={item.id} item={item} index={index} onRequest={(equipment) => {
                  setDueAt(undefined)
                  setLoanError('')
                  setSelected(equipment)
                }} />)}
              </div>
            ) : <StatusState kind="empty" query={query} onClear={() => { setQuery(''); setFilter('Todos') }} />}
            <p className="photo-credit"><a href="https://pixabay.com/">Fotos: Pixabay</a></p>
          </section>
        </>}
      </main>
      {selected && <LoanDialog item={selected} dueAt={dueAt} busy={submitting} error={loanError} onCancel={closeDialog} onConfirm={() => void confirmRequest()} />}
    </div>
  )
}

function MyLoans() {
  const [loans, setLoans] = useState<OpenLoan[]>()
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    void listMyLoans()
      .then((result) => { if (active) setLoans(result) })
      .catch(() => { if (active) setError(true) })
    return () => { active = false }
  }, [])

  return (
    <section aria-labelledby="loans-heading">
      <h1 id="loans-heading">Meus empréstimos</h1>
      {error ? <p role="alert">Não foi possível carregar seus empréstimos.</p>
        : !loans ? <p role="status">Carregando empréstimos…</p>
        : loans.length === 0 ? <p>Você não tem empréstimos em aberto.</p>
        : <ul className="loan-list">{loans.map((loan) => (
          <li className="card" key={loan.id}>
            <strong>{loan.equipment.name}</strong>
            <span>Devolver até <time dateTime={loan.dueAt}>{formatDate(loan.dueAt)}</time></span>
          </li>
        ))}</ul>}
    </section>
  )
}

export function App() {
  const [userId, setUserId] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    if (!supabase) return
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (supabase && userId === undefined) return <div className="state-box" role="status">Carregando sessão…</div>
  if (!userId) return <Login onLoggedIn={() => undefined} />
  return <CatalogApp key={userId} />
}

function filterToStatus(filter: Filter): EquipmentStatus | null {
  const statusMap: Record<Exclude<Filter, 'Todos'>, EquipmentStatus> = {
    Disponíveis: 'disponivel',
    Emprestados: 'emprestado',
    'Em manutenção': 'manutencao',
  }
  return filter === 'Todos' ? null : statusMap[filter]
}
