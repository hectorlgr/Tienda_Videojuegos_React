import { Navigate, Route, Routes } from 'react-router-dom'
import StoreLayout from '../layouts/StoreLayout'
import AdminLayout from '../layouts/AdminLayout'
import ProtectedRoute from '../components/common/ProtectedRoute'
import HomePage from '../pages/HomePage'
import ProductsPage from '../pages/ProductsPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import CartPage from '../pages/CartPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ContactPage from '../pages/ContactPage'
import ReviewsPage from '../pages/ReviewsPage'
import NotFoundPage from '../pages/NotFoundPage'
import AdminOrdersPage from '../pages/admin/AdminOrdersPage'
import AdminStockPage from '../pages/admin/AdminStockPage'
import AdminProductCreatePage from '../pages/admin/AdminProductCreatePage'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<HomePage />} />
        <Route path="productos" element={<ProductsPage />} />
        <Route path="productos/:id" element={<ProductDetailPage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="registro" element={<RegisterPage />} />
        <Route path="contacto" element={<ContactPage />} />
        <Route path="criticas" element={<ReviewsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['vendedor', 'administrador']} />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="ordenes" replace />} />
          <Route path="ordenes" element={<AdminOrdersPage />} />
          <Route element={<ProtectedRoute allowedRoles={['administrador']} redirectTo="/admin/ordenes" />}>
            <Route path="stock" element={<AdminStockPage />} />
            <Route path="productos/nuevo" element={<AdminProductCreatePage />} />
          </Route>
          <Route path="*" element={<NotFoundPage admin />} />
        </Route>
      </Route>
    </Routes>
  )
}
