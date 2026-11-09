import { useEffect, useMemo, useState } from 'react'
import { Login } from './Login'
import { supabase } from './auth'
import { borrowEquipment, listEquipment } from './api'
import {
  CatalogHeader,
  EquipmentCard,
  FilterBar,
  LoanDialog,
  Navigation,
  StatusState,
} from './components'
import type { Equipment, EquipmentStatus, Filter } from './data/mock-data'

const currentUser = { name: 'Minha conta', initials: 'EU', role: 'Colaborador' }

export function App() {
  const [sessionReady, setSessionReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [items, setItems] = useState<Equipment[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('Todos')
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setSessionReady(true)
      return
    }
    void supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(Boolean(data.session))
      setSessionReady(true)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setAuthenticated(Boolean(nextSession))
      setSessionReady(true)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!authenticated) return
    setLoading(true)
    setError('')
    void listEquipment()
      .then(setItems)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Não foi possível carregar o catálogo.'))
      .finally(() => setLoading(false))
  }, [authenticated])

  const availableCount = items.filter((item) => item.status === 'disponivel').length
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    return items.filter((item) => {
      const matchesQuery = [item.name, item.assetTag].some((value) => value.toLocaleLowerCase('pt-BR').includes(normalizedQuery))
      return matchesQuery && (filter === 'Todos' || item.status === filterToStatus(filter))
    })
  }, [filter, items, query])

  async function confirmRequest() {
    if (!selectedItem) return
    try {
      await borrowEquipment(selectedItem.id)
      setSelectedItem(null)
      setToast(`${selectedItem.name} foi solicitado.`)
      setItems(await listEquipment())
      window.setTimeout(() => setToast(''), 2600)
    } catch (reason: unknown) {
      setToast(reason instanceof Error ? reason.message : 'Não foi possível solicitar o equipamento.')
    }
  }

  if (!sessionReady) return <div className="state-box" role="status">Carregando sessão…</div>
  if (!authenticated) return <Login onLoggedIn={() => setAuthenticated(true)} />

  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo-principal">Ir para o conteúdo principal</a>
      <Navigation currentUser={currentUser} />
      <main id="conteudo-principal" className="page-content catalog-page">
        <CatalogHeader availableCount={availableCount} totalCount={items.length} query={query} onQueryChange={setQuery} />
        <FilterBar activeFilter={filter} onFilterChange={setFilter} />
        <section className="catalog-section" aria-labelledby="equipment-heading">
          <div className="section-heading">
            <div><span className="section-kicker">Inventário interno</span><h2 id="equipment-heading">Equipamentos para retirada</h2></div>
            <span className="section-count">{filteredItems.length} itens exibidos</span>
          </div>
          {loading ? <StatusState kind="loading" /> : error ? <StatusState kind="error" /> : filteredItems.length > 0 ? (
            <div className="catalog-grid" role="list" aria-label="Catálogo de equipamentos">
              {filteredItems.map((item, index) => <EquipmentCard key={item.id} item={item} index={index} blocked={false} atLimit={false} onRequest={setSelectedItem} />)}
            </div>
          ) : <StatusState kind="empty" query={query} onClear={() => { setQuery(''); setFilter('Todos') }} />}
        </section>
        <footer className="page-footer"><span>Dados persistidos no inventário da Operação</span><span>Prazo padrão de devolução: 14 dias</span></footer>
      </main>
      {selectedItem && <LoanDialog item={selectedItem} onCancel={() => setSelectedItem(null)} onConfirm={() => void confirmRequest()} />}
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  )
}

function filterToStatus(filter: Filter): EquipmentStatus | null {
  const statusMap: Record<Exclude<Filter, 'Todos'>, EquipmentStatus> = {
    Disponíveis: 'disponivel',
    Emprestados: 'emprestado',
    'Em manutenção': 'manutencao',
  }
  return filter === 'Todos' ? null : statusMap[filter]
}
