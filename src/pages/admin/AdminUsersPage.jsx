import { Link } from 'react-router-dom'
import { useAdminUsers } from '../../hooks/useAdminUsers'
import { fullName, roleBadgeClass, roleLabel } from '../../utils/adminUsers'

function displayValue(value) {
  return value == null || value === '' ? '—' : value
}

export default function AdminUsersPage() {
  const { users, loading, error } = useAdminUsers()

  return (
    <section className="section admin-users-page" aria-labelledby="users-title">
      <title>Usuarios — CheckPoint Store</title>
      <div className="container">
        <div className="mb-4">
          <h1 id="users-title" className="mb-1">Usuarios</h1>
          <p className="text-muted mb-0">Cuentas registradas en la tienda.</p>
        </div>

        {loading ? (
          <p className="catalog-state" role="status">Cargando usuarios...</p>
        ) : error ? (
          <p className="alert alert-danger" role="alert">No fue posible cargar los usuarios.</p>
        ) : users.length === 0 ? (
          <p className="catalog-state" role="status">No hay usuarios registrados.</p>
        ) : (
          <>
            <p id="users-scroll-help" className="text-muted small">
              {users.length} {users.length === 1 ? 'usuario' : 'usuarios'}. Si la tabla no cabe en pantalla, desplázala horizontalmente.
            </p>
            <div
              className="table-responsive admin-users-table"
              role="region"
              aria-labelledby="users-title"
              aria-describedby="users-scroll-help"
              tabIndex={0}
            >
              <table className="table table-striped table-hover align-middle mb-0">
                <caption className="visually-hidden">Usuarios registrados con su rol</caption>
                <thead className="table-dark">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">RUN</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Comuna</th>
                    <th scope="col">Rol</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{displayValue(user.id)}</td>
                      <th scope="row">{displayValue(fullName(user))}</th>
                      <td className="text-nowrap">{displayValue(user.run)}</td>
                      <td>{displayValue(user.correo)}</td>
                      <td>{displayValue(user.comuna)}</td>
                      <td><span className={`badge ${roleBadgeClass(user.rol)}`}>{roleLabel(user.rol)}</span></td>
                      <td>
                        <Link
                          className="btn btn-sm btn-primary text-nowrap"
                          to={`/admin/usuarios/${user.id}`}
                          aria-label={`Ver detalle de ${displayValue(fullName(user) || user.correo)}`}
                        >
                          Ver detalle
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
