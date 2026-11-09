import { useEffect, useRef } from 'react'
import { Archive, ArrowRight, Check, Clock, MagnifyingGlass, Wrench, X } from '@phosphor-icons/react'
import { formatDate, type Equipment, type EquipmentStatus, type Filter } from './equipment'

const filters: Filter[] = ['Todos', 'Disponíveis', 'Emprestados', 'Em manutenção']

type User = { name: string; initials: string; role: string }

export type Page = 'Catálogo' | 'Meus empréstimos'
const tabs: Page[] = ['Catálogo', 'Meus empréstimos']

export function Navigation({ currentUser, page, onNavigate, onSignOut }: {
  currentUser: User; page: Page; onNavigate: (page: Page) => void; onSignOut: () => void
}) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="#conteudo-principal" aria-label="emprestAI, ir para o catálogo">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>EMPREST<span className="brand-accent">.AI</span></span>
        </a>
        <nav className="main-nav" aria-label="Navegação principal">
          {tabs.map((tab) => (
            <button
              className={`nav-tab ${tab === page ? 'active' : ''}`}
              type="button"
              key={tab}
              aria-current={tab === page ? 'page' : undefined}
              onClick={() => onNavigate(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="profile-area">
          <span className="tag tag-outline">{currentUser.role}</span>
          <span className="avatar" aria-hidden="true">{currentUser.initials}</span>
          <span className="profile-name">{currentUser.name}</span>
          <button className="logout-button" type="button" onClick={onSignOut}>Sair</button>
        </div>
      </div>
    </header>
  )
}

export function CatalogHeader({ availableCount, totalCount, query, onQueryChange }: { availableCount: number; totalCount: number; query: string; onQueryChange: (value: string) => void }) {
  return (
    <div className="catalog-header">
      <div>
        <span className="page-kicker">Equipamentos internos</span>
        <h1>Catálogo</h1>
        <p>{availableCount} de {totalCount} equipamentos disponíveis agora</p>
      </div>
      <label className="search-field">
        <span className="sr-only">Buscar por nome ou patrimônio</span>
        <MagnifyingGlass size={18} aria-hidden="true" />
        <input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Buscar equipamento" />
      </label>
    </div>
  )
}

export function FilterBar({ activeFilter, onFilterChange }: { activeFilter: Filter; onFilterChange: (filter: Filter) => void }) {
  return (
    <div className="filter-bar" aria-label="Filtrar equipamentos">
      <span className="filter-label">Filtrar por situação</span>
      <div className="filter-options" role="group" aria-label="Situação do equipamento">
        {filters.map((filter) => (
          <button className={`filter-chip ${activeFilter === filter ? 'active' : ''}`} type="button" key={filter} aria-pressed={activeFilter === filter} onClick={() => onFilterChange(filter)}>
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}

export function EquipmentCard({ item, index, onRequest }: { item: Equipment; index: number; onRequest: (item: Equipment) => void }) {
  const isAvailable = item.status === 'disponivel'
  const buttonLabel = isAvailable ? 'Solicitar empréstimo' : item.status === 'emprestado' ? 'Emprestado' : 'Indisponível'

  return (
    <article className="equipment-card card" role="listitem" style={{ animationDelay: `${index * 35}ms` }}>
      {item.imageUrl && <img className="equipment-photo" src={item.imageUrl} alt={item.name} width={800} height={600} loading="lazy" />}
      <div className="card-topline">
        <span className="card-kicker">{item.category}</span>
        <StatusPill status={item.status} />
      </div>
      <h3 className="card-title">{item.name}</h3>
      <span className="asset-tag">Patrimônio {item.assetTag}</span>
      <div className={`card-detail detail-${item.status}`}>
        {item.status === 'disponivel' && <><Check size={16} aria-hidden="true" /><span>Pronto para retirada no balcão</span></>}
        {item.status === 'emprestado' && <><Clock size={16} aria-hidden="true" /><span>Indisponível para retirada</span></>}
        {item.status === 'manutencao' && <><Wrench size={16} aria-hidden="true" /><span>{item.note}</span></>}
      </div>
      <button className={`btn card-action ${isAvailable ? 'btn-primary' : 'btn-secondary'}`} type="button" disabled={!isAvailable} onClick={() => onRequest(item)}>
        {buttonLabel}
        {isAvailable && <ArrowRight size={16} aria-hidden="true" />}
      </button>
    </article>
  )
}

function StatusPill({ status }: { status: EquipmentStatus }) {
  const statusCopy = { disponivel: 'Disponível', emprestado: 'Emprestado', manutencao: 'Em manutenção' }
  return <span className={`status-pill status-${status}`}>{statusCopy[status]}</span>
}

export function LoanDialog({ item, dueAt, busy, error, onCancel, onConfirm }: {
  item: Equipment; dueAt?: string; busy: boolean; error: string; onCancel: () => void; onConfirm: () => void
}) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelRef.current?.focus()
    const handleEscape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !busy) onCancel() }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [busy, onCancel])

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel() }}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="loan-dialog-title">
        <div className="dialog-heading">
          <div>
            <span className="section-kicker">Nova solicitação</span>
            <h2 className="dialog-title" id="loan-dialog-title">{dueAt ? 'Empréstimo criado' : 'Solicitar equipamento?'}</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Fechar diálogo" disabled={busy} onClick={onCancel}><X size={18} aria-hidden="true" /></button>
        </div>
        <p className="dialog-body">O equipamento ficará vinculado ao seu nome até a devolução no balcão.</p>
        <div className="dialog-summary">
          <span><small>Equipamento</small><strong>{item.name}</strong></span>
          <span><small>{dueAt ? 'Devolver até' : 'Prazo de devolução'}</small><strong className="accent-text">{dueAt ? formatDate(dueAt) : '14 dias corridos'}</strong></span>
        </div>
        {error && <p role="alert">{error}</p>}
        <div className="dialog-actions">
          <button className="btn btn-secondary" type="button" ref={cancelRef} disabled={busy} onClick={onCancel}>{dueAt ? 'Fechar' : 'Cancelar'}</button>
          {!dueAt && <button className="btn btn-primary" type="button" disabled={busy} onClick={onConfirm}>{busy ? 'Solicitando…' : 'Confirmar solicitação'}</button>}
        </div>
      </section>
    </div>
  )
}

export function StatusState({ kind, query, onClear }: { kind: 'empty' | 'loading' | 'error'; query?: string; onClear?: () => void }) {
  if (kind === 'loading') return <div className="state-box" role="status" aria-busy="true"><span className="loading-line" /><span className="loading-line short" /></div>
  if (kind === 'error') return <div className="state-box" role="alert"><Archive size={24} aria-hidden="true" /><strong>Não foi possível carregar o catálogo</strong><span>Tente novamente em alguns instantes.</span></div>
  return <div className="state-box"><Archive size={24} aria-hidden="true" /><strong>Nenhum equipamento encontrado</strong><span>{query ? 'Ajuste a busca ou remova o filtro para ver outros itens.' : 'Não há itens nesta situação no momento.'}</span>{onClear && <button className="btn btn-secondary" type="button" onClick={onClear}>Limpar busca e filtros</button>}</div>
}