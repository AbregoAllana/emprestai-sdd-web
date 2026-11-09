import { supabase } from './auth'

const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '')

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiUrl || !supabase) throw new Error('Configure a API e o Supabase para usar o sistema.')
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Sua sessão expirou. Entre novamente.')

  const headers = new Headers(init?.headers)
  headers.set('Authorization', 'Bearer ' + token)
  const response = await fetch(apiUrl + path, { ...init, headers })
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)
    const message = body && typeof body === 'object' && 'message' in body ? body.message : null
    throw new Error(typeof message === 'string' ? message : 'Não foi possível concluir a operação.')
  }
  return response.json() as Promise<T>
}
