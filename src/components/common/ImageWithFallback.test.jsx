import { afterEach, describe, it, expect } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import ImageWithFallback from './ImageWithFallback.jsx'

// No usamos "globals" de Vitest, así que el DOM no se limpia solo entre pruebas.
afterEach(cleanup)

describe('ImageWithFallback', () => {
  it('renderiza una imagen válida con sus propiedades', () => {
    render(
      <ImageWithFallback src="img/cara_ps5.jpg" alt="PlayStation 5" className="foto" loading="lazy" />,
    )

    const img = screen.getByRole('img', { name: 'PlayStation 5' })
    expect(img).toHaveAttribute('src', 'img/cara_ps5.jpg')
    expect(img).toHaveClass('foto')
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('cambia a la imagen de respaldo cuando la imagen falla al cargar', () => {
    render(<ImageWithFallback src="img/no-existe.jpg" alt="Producto" />)

    const img = screen.getByRole('img', { name: 'Producto' })
    expect(img).toHaveAttribute('src', 'img/no-existe.jpg')

    fireEvent.error(img)
    expect(img.getAttribute('src')).toMatch(/image-placeholder\.svg$/)

    // Si el propio respaldo falla no hay bucle: la imagen sigue siendo el respaldo.
    fireEvent.error(img)
    expect(img.getAttribute('src')).toMatch(/image-placeholder\.svg$/)
  })

  it('usa la imagen de respaldo cuando la fuente está vacía o no es válida', () => {
    const { rerender } = render(<ImageWithFallback src="" alt="Producto" />)
    expect(screen.getByRole('img', { name: 'Producto' }).getAttribute('src')).toMatch(/image-placeholder\.svg$/)

    rerender(<ImageWithFallback src={undefined} alt="Producto" />)
    expect(screen.getByRole('img', { name: 'Producto' }).getAttribute('src')).toMatch(/image-placeholder\.svg$/)

    rerender(<ImageWithFallback src={null} alt="Producto" />)
    expect(screen.getByRole('img', { name: 'Producto' }).getAttribute('src')).toMatch(/image-placeholder\.svg$/)
  })
})