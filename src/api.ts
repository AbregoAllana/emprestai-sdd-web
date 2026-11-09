import type { Equipment } from './data/mock-data'
import { supabase } from './auth'

const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '')

type ApiEquipment = {
  id: string
  name: string
  category: string
  assetTag: string | null
  condition: 'AVAILABLE' | 'MAINTENANCE'
  notes: string | null
  loan: { id: string; borrowerUserId: string; dueAt: string } | null
}

function requireConfig(): { baseUrl: string } {
  if (!apiUrl || !supabase) throw new Error('Configure a API e o Supabase para usar o sistema.')
  return { baseUrl: apiUrl }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const { baseUrl } = requireConfig()
  const { data } = await supabase!.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Sua sessão expirou. Entre novamente.')

  const response = await fetch(`${baseUrl}/v1${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...init?.headers },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(body?.message ?? 'Não foi possível concluir a operação.')
  }
  return response.json() as Promise<T>
}

export async function listEquipment(): Promise<Equipment[]> {
  const result = await request<ApiEquipment[]>('/equipment')
  return result.map((item) => ({
    id: item.id,
    category: item.category,
    name: item.name,
    assetTag: item.assetTag ?? '—',
    status: item.condition === 'MAINTENANCE' ? 'manutencao' : item.loan ? 'emprestado' : 'disponivel',
    loanedTo: item.loan?.borrowerUserId,
    dueDate: item.loan ? new Intl.DateTimeFormat('pt-BR').format(new Date(item.loan.dueAt)) : undefined,
    note: item.notes ?? 'Item em manutenção',
  }))
}

export function borrowEquipment(id: string): Promise<unknown> {
  return request(`/loans/${id}`, { method: 'POST' })
}
