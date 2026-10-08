import { Outlet } from 'react-router-dom'
import StoreHeader from '../components/store/StoreHeader'
import StoreNavbar from '../components/store/StoreNavbar'
import StoreFooter from '../components/store/StoreFooter'

export default function StoreLayout() {
  return (
    <div className="app-shell store-layout">
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <StoreHeader />
      <StoreNavbar />
      <main id="main-content" tabIndex={-1}><Outlet /></main>
      <StoreFooter />
    </div>
  )
}
