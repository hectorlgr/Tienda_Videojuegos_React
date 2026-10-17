import { Route, Routes } from 'react-router-dom'
import StoreLayout from '../layouts/StoreLayout'
import AdminLayout from '../layouts/AdminLayout'
import ProtectedRoute from '../components/common/ProtectedRoute'
import HomePage from '../pages/HomePage'
import ProductsPage from '../pages/ProductsPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import CartPage from '../pages/CartPage'
import CheckoutPage from '../pages/CheckoutPage'
import PurchaseSuccessPage from '../pages/PurchaseSuccessPage'
import PurchaseFailurePage from '../pages/PurchaseFailurePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ContactPage from '../pages/ContactPage'
import ReviewsPage from '../pages/ReviewsPage'
import NotFoundPage from '../pages/NotFoundPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminOrdersPage from '../pages/admin/AdminOrdersPage'
import AdminProductsPage from '../pages/admin/AdminProductsPage'
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
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="compra-exitosa" element={<PurchaseSuccessPage />} />
        <Route path="compra-rechazada" element={<PurchaseFailurePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="registro" element={<RegisterPage />} />
        <Route path="contacto" element={<ContactPage />} />
        <Route path="criticas" element={<ReviewsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['vendedor', 'administrador']} />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route path="ordenes" element={<AdminOrdersPage />} />
          {/* El vendedor que entra a /admin vuelve a Órdenes mediante este guard. */}
          <Route element={<ProtectedRoute allowedRoles={['administrador']} redirectTo="/admin/ordenes" />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="productos" element={<AdminProductsPage />} />
            <Route path="stock" element={<AdminStockPage />} />
            <Route path="productos/nuevo" element={<AdminProductCreatePage />} />
          </Route>
          <Route path="*" element={<NotFoundPage admin />} />
        </Route>
      </Route>
    </Routes>
  )
}
