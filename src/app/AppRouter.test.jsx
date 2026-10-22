import { afterEach, describe, it, expect } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppRouter from './AppRouter.jsx'
import AuthProvider from '../context/AuthProvider.jsx'
import CartProvider from '../context/CartProvider.jsx'

afterEach(cleanup)

function renderizarRuta(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('AppRouter', () => {
  it('/contacto muestra la vista Contacto', () => {
    renderizarRuta('/contacto')

    expect(screen.getByRole('heading', { name: 'Ponte en contacto con nosotros' })).toBeInTheDocument()
  })

  it('/criticas muestra su vista y no la de Contacto', () => {
    renderizarRuta('/criticas')

    expect(screen.getByRole('heading', { level: 1, name: 'Críticas y noticias' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Ponte en contacto con nosotros' })).not.toBeInTheDocument()
  })

  it('una ruta inexistente muestra el 404', () => {
    renderizarRuta('/esta-ruta-no-existe')

    expect(screen.getByRole('heading', { name: '404 — Página no encontrada' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toBeInTheDocument()
  })
})