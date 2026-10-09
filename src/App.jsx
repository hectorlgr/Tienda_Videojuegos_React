import { BrowserRouter } from 'react-router-dom'
import AppRouter from './app/AppRouter'
import AuthProvider from './context/AuthProvider'
import CartProvider from './context/CartProvider'

export default function App() {
  // El campo de búsqueda controlado por la URL necesita actualizaciones inmediatas.
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL} useTransitions={false}>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
