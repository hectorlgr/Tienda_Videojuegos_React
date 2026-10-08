import { Link } from 'react-router-dom'
import BrandLogo from '../common/BrandLogo'
import TopBar from '../common/TopBar'

export default function StoreHeader() {
  return (
    <header>
      <TopBar showAccount />
      <div id="header">
        <div className="container">
          <div className="row align-items-center gy-3">
            <div className="col-lg-3"><BrandLogo /></div>
            <div className="col-lg-6">
              <div className="header-search">
                <div className="store-search" role="search" aria-label="Búsqueda de productos">
                  <label className="visually-hidden" htmlFor="store-search">Buscar productos (próximamente)</label>
                  <input id="store-search" className="input" type="search" placeholder="Buscar producto..." disabled />
                  <button className="search-btn" type="button" disabled>Buscar</button>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="header-ctn">
                <div>
                  <Link to="/carrito"><i className="fa fa-shopping-cart" aria-hidden="true" /><span>Mi Carrito</span></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
