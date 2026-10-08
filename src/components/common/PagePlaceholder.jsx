import { useEffect } from 'react'

export default function PagePlaceholder({ title, description = 'Esta sección estará disponible próximamente.', children }) {
  useEffect(() => {
    document.title = `${title} — CheckPoint Store`
  }, [title])

  return (
    <section className="section placeholder-section">
      <div className="container">
        <div className="page-placeholder">
          <p className="placeholder-eyebrow">CheckPoint Store</p>
          <h1>{title}</h1>
          <p className="text-muted mb-0">{description}</p>
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </section>
  )
}
