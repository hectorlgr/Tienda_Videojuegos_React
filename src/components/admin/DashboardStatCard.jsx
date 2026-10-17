import { Link } from 'react-router-dom'

export default function DashboardStatCard({ label, value, icon, description, to, linkText }) {
  const available = Number.isSafeInteger(value)

  return (
    <article className="card h-100 shadow-sm admin-stat-card">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <h2 className="admin-stat-label">{label}</h2>
          <i className={`fa ${icon} admin-stat-icon`} aria-hidden="true" />
        </div>
        <p className="admin-stat-value">{available ? value : '—'}</p>
        <p className="text-muted small mb-0">{available ? description : 'Dato no disponible.'}</p>
        {to && (
          <Link className="admin-stat-link mt-auto pt-3" to={to}>
            {linkText} <i className="fa fa-angle-right" aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  )
}
