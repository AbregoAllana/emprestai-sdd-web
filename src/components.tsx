import { useEffect, useRef } from 'react'
import { Archive, ArrowRight, Check, Clock, MagnifyingGlass, Wrench, X } from '@phosphor-icons/react'
import type { Equipment, EquipmentStatus, Filter } from './data/mock-data'

const filters: Filter[] = ['Todos', 'Disponíveis', 'Emprestados', 'Em manutenção']

type User = { name: string; initials: string; role: string }

export function Navigation({ currentUser }: { currentUser: User }) {
  const tabs = currentUser.role === 'Operações'
    ? ['Catálogo', 'Operações', 'Equipamentos', 'Meus empréstimos']
    : ['Catálogo', 'Meus empréstimos']

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
              className={`nav-tab ${tab === 'Catálogo' ? 'active' : ''}`}
              type="button"
              key={tab}
              aria-current={tab === 'Catálogo' ? 'page' : undefined}
              onClick={() => undefined}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="profile-area">
          <span className="tag tag-outline">{currentUser.role}</span>
          <span className="avatar" aria-hidden="true">{currentUser.initials}</span>
          <span className="profile-name">{currentUser.name}</span>
          <button className="logout-button" type="button" onClick={() => undefined}>Sair</button>
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

export function EquipmentCard({ item, index, blocked, atLimit, onRequest }: { item: Equipment; index: number; blocked: boolean; atLimit: boolean; onRequest: (item: Equipment) => void }) {
  const isMine = item.loanedTo === 'Ana Ribeiro'
  const isAvailable = item.status === 'disponivel'
  const unavailableLabel = isMine ? 'Está com você' : blocked ? 'Bloqueado por atraso' : atLimit ? 'Limite de 3 itens' : 'Indisponível'
  const buttonLabel = isAvailable && !blocked && !atLimit ? 'Solicitar empréstimo' : item.status === 'manutencao' ? 'Indisponível' : item.status === 'emprestado' ? (isMine ? 'Está com você' : 'Emprestado') : unavailableLabel

  return (
    <article className="equipment-card card" role="listitem" style={{ animationDelay: `${index * 35}ms` }}>
      <div className="card-topline">
        <span className="card-kicker">{item.category}</span>
        <StatusPill status={item.status} />
      </div>
      <h3 className="card-title">{item.name}</h3>
      <span className="asset-tag">Patrimônio {item.assetTag}</span>
      <div className={`card-detail detail-${item.status}`}>
        {item.status === 'disponivel' && <><Check size={16} aria-hidden="true" /><span>Pronto para retirada no balcão</span></>}
        {item.status === 'emprestado' && <><Clock size={16} aria-hidden="true" /><span>Com {item.loanedTo} · devolver até {item.dueDate}</span></>}
        {item.status === 'manutencao' && <><Wrench size={16} aria-hidden="true" /><span>{item.note}</span></>}
      </div>
      <button className={`btn card-action ${isAvailable && !blocked && !atLimit ? 'btn-primary' : 'btn-secondary'}`} type="button" disabled={!isAvailable || blocked || atLimit} onClick={() => onRequest(item)}>
        {buttonLabel}
        {isAvailable && !blocked && !atLimit && <ArrowRight size={16} aria-hidden="true" />}
      </button>
    </article>
  )
}

function StatusPill({ status }: { status: EquipmentStatus }) {
  const statusCopy = { disponivel: 'Disponível', emprestado: 'Emprestado', manutencao: 'Em manutenção' }
  return <span className={`status-pill status-${status}`}>{statusCopy[status]}</span>
}

export function LoanDialog({ item, onCancel, onConfirm }: { item: Equipment; onCancel: () => void; onConfirm: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelRef.current?.focus()
    const handleEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onCancel() }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onCancel])

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="loan-dialog-title">
        <div className="dialog-heading">
          <div>
            <span className="section-kicker">Nova solicitação</span>
            <h2 className="dialog-title" id="loan-dialog-title">Solicitar equipamento?</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Fechar diálogo" onClick={onCancel}><X size={18} aria-hidden="true" /></button>
        </div>
        <p className="dialog-body">O equipamento ficará vinculado ao seu nome até a devolução no balcão.</p>
        <div className="dialog-summary">
          <span><small>Equipamento</small><strong>{item.name}</strong></span>
          <span><small>Devolver até</small><strong className="accent-text">14/09/2026</strong></span>
        </div>
        <div className="dialog-actions">
          <button className="btn btn-secondary" type="button" ref={cancelRef} onClick={onCancel}>Cancelar</button>
          <button className="btn btn-primary" type="button" onClick={onConfirm}>Confirmar solicitação</button>
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