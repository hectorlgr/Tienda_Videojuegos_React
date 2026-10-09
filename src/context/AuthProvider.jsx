import { useState } from 'react'
import { AuthContext } from './AuthContext'
import { clearSession, persistSession, readSession, sanitizeSessionUser } from '../utils/authSession'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)

  // Recibe un usuario ya verificado; la búsqueda y comparación de password ocurren fuera.
  function login(validatedUser) {
    const sessionUser = sanitizeSessionUser(validatedUser)
    if (sessionUser === null) {
      throw new TypeError('El usuario recibido no es válido para iniciar sesión.')
    }
    persistSession(sessionUser)
    setUser(sessionUser)
  }

  function logout() {
    clearSession()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
