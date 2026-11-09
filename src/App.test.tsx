import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { App } from './App'

describe('Autenticacao', () => {
  test('test_ca_01_exibe_login_sem_catalogo_para_usuario_sem_sessao', async () => {
    render(<App />)

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument())
    expect(screen.getByRole('textbox', { name: 'E-mail' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Catálogo' })).not.toBeInTheDocument()
  })
})
