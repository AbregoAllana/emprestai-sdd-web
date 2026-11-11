import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'
import { App } from './App'
import { ApiError } from './api-request'
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
  window.history.replaceState(null, '', '/')
  vi.resetAllMocks()
  state.userId = 'user-test'
  vi.mocked(listEquipment).mockResolvedValue([notebook, { ...notebook, id: 'two', assetTag: 'TI-0004', name: 'Notebook em manutenção', status: 'manutencao' }])
})

test('004/CA-01 e CA-03 a entrada pública oferece acesso por teclado sem consultar o catálogo', async () => {
  state.userId = null
  render(<App />)
  expect(await screen.findByRole('heading', { name: 'Empréstimo de equipamentos sem planilha' })).toBeInTheDocument()
  const enterLink = screen.getByRole('link', { name: 'Entrar' })
  expect(enterLink).toHaveAttribute('href', '/entrar')
  const user = userEvent.setup()
  await user.tab()
  await user.tab()
  expect(enterLink).toHaveFocus()
  expect(listEquipment).not.toHaveBeenCalled()
})

test('004/CA-02 e 003/CA-01 acesso direto ao login mantém o catálogo protegido', async () => {
  state.userId = null
  window.history.replaceState(null, '', '/entrar')
  render(<App />)
  expect(await screen.findByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
  expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  expect(listEquipment).not.toHaveBeenCalled()
})

test('004/CA-02 sessão ativa em /entrar abre o catálogo', async () => {
  window.history.replaceState(null, '', '/entrar')
  render(<App />)
  expect(await screen.findByRole('heading', { name: 'Catálogo' })).toBeInTheDocument()
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

test('003/CA-03 e CA-04 sincroniza o catálogo quando outra solicitação vence a disputa', async () => {
  vi.mocked(listEquipment)
    .mockResolvedValueOnce([notebook])
    .mockResolvedValueOnce([{ ...notebook, status: 'emprestado' }])
  vi.mocked(borrowEquipment).mockRejectedValue(new ApiError('Equipamento indisponível', 409))
  render(<App />)
  const dialog = await confirm()
  expect(await within(dialog).findByRole('alert')).toHaveTextContent('Equipamento indisponível')
  expect(await screen.findByRole('button', { name: 'Emprestado' })).toBeDisabled()
  const retry = await within(dialog).findByRole('button', { name: 'Confirmar solicitação' })
  expect(retry).toBeDisabled()
  fireEvent.click(retry)
  expect(borrowEquipment).toHaveBeenCalledTimes(1)
  expect(listEquipment).toHaveBeenCalledTimes(2)
})

test('003/CA-05 Meus empréstimos lista equipamento e data', async () => {
  vi.mocked(listMyLoans).mockResolvedValue([{ id: 'loan', dueAt: '2026-11-23T16:00:00.000Z', equipment: { id: notebook.id, name: notebook.name, assetTag: notebook.assetTag } }])
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'Meus empréstimos' }))
  expect(await screen.findByRole('listitem')).toHaveTextContent(notebook.name)
  expect(screen.getByText('23/11/2026')).toBeInTheDocument()
})
