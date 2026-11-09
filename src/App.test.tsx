import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { App } from './App'
import { borrowEquipment, listEquipment, listMyLoans } from './api'

const state = vi.hoisted(() => ({ userId: null as string | null }))
vi.mock('./auth', () => ({
  supabase: { auth: { onAuthStateChange: (listener: (event: string, session: unknown) => void) => {
    listener('INITIAL_SESSION', state.userId ? { user: { id: state.userId } } : null)
    return { data: { subscription: { unsubscribe: vi.fn() } } }
  } } },
}))
vi.mock('./api', () => ({
  listEquipment: vi.fn(),
  borrowEquipment: vi.fn(),
  listMyLoans: vi.fn(),
}))

const imageUrl = 'https://example.supabase.co/storage/v1/object/public/equipment-images/equipment/TI-0001.jpg'
const notebook = { id: 'one', name: 'Notebook 14 polegadas', category: 'Notebook', assetTag: 'TI-0001', status: 'disponivel' as const, imageUrl }

beforeEach(() => {
  vi.resetAllMocks()
  state.userId = 'user-test'
  vi.mocked(listEquipment).mockResolvedValue([notebook, { ...notebook, id: 'two', assetTag: 'TI-0004', name: 'Notebook em manutenção', status: 'manutencao' }])
})

test('003/CA-01 sem sessão fica no login', async () => {
  state.userId = null
  render(<App />)
  expect(await screen.findByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
  expect(listEquipment).not.toHaveBeenCalled()
})

test('003/CA-01 e CA-03 catálogo mostra foto e crédito e impede manutenção', async () => {
  render(<App />)
  expect(await screen.findByRole('img', { name: notebook.name })).toHaveAttribute('src', imageUrl)
  expect(screen.getByRole('link', { name: 'Fotos: Pixabay' })).toHaveAttribute('href', 'https://pixabay.com/')
  expect(screen.getByRole('button', { name: 'Indisponível' })).toBeDisabled()
})

async function confirm() {
  fireEvent.click(await screen.findByRole('button', { name: 'Solicitar empréstimo' }))
  const dialog = screen.getByRole('dialog')
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirmar solicitação' }))
  return dialog
}

test('003/CA-02 mostra o prazo da API e atualiza o card', async () => {
  vi.mocked(borrowEquipment).mockResolvedValue({ id: 'loan', equipmentId: notebook.id, dueAt: '2026-11-23T16:00:00.000Z' })
  render(<App />)
  const dialog = await confirm()
  expect(await within(dialog).findByText('23/11/2026')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Emprestado' })).toBeDisabled()
  expect(borrowEquipment).toHaveBeenCalledWith(notebook.id)
})

test('003/CA-03 exibe o motivo da recusa no diálogo', async () => {
  vi.mocked(borrowEquipment).mockRejectedValue(new Error('Limite de 3 empréstimos em aberto atingido'))
  render(<App />)
  const dialog = await confirm()
  expect(await within(dialog).findByRole('alert')).toHaveTextContent('Limite de 3 empréstimos')
})

test('003/CA-05 Meus empréstimos lista equipamento e data', async () => {
  vi.mocked(listMyLoans).mockResolvedValue([{ id: 'loan', dueAt: '2026-11-23T16:00:00.000Z', equipment: { id: notebook.id, name: notebook.name, assetTag: notebook.assetTag } }])
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'Meus empréstimos' }))
  expect(await screen.findByRole('listitem')).toHaveTextContent(notebook.name)
  expect(screen.getByText('23/11/2026')).toBeInTheDocument()
})
