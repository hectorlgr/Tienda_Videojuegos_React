import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CATALOG_CATEGORIES } from '../../config/catalogCategories'
import BrandLogo from '../common/BrandLogo'
import TopBar from '../common/TopBar'

function StoreSearchForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const isCatalog = location.pathname === '/productos' || location.pathname === '/productos/'
  const [searchValue, setSearchValue] = useState(() => (
    isCatalog ? new URLSearchParams(location.search).get('q') ?? '' : ''
  ))

  function handleSubmit(event) {
    event.preventDefault()
    const params = new URLSearchParams(isCatalog ? location.search : '')
    const selectedCategories = params.getAll('categoria')
    params.delete('categoria')
    CATALOG_CATEGORIES.forEach(({ value }) => {
      if (selectedCategories.includes(value)) params.append('categoria', value)
    })

    params.delete('q')
    const term = searchValue.trim()
    if (term) params.set('q', term)

    const query = params.toString()
    navigate({ pathname: '/productos', search: query ? `?${query}` : '' })
  }

  return (
    <form className="store-search" role="search" aria-label="Búsqueda de productos" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="store-search">Buscar productos</label>
      <input
        id="store-search"
        name="q"
        className="input"
        type="search"
        placeholder="Buscar producto..."
        value={searchValue}
        onChange={event => setSearchValue(event.target.value)}
      />
      <button className="search-btn" type="submit">Buscar</button>
    </form>
  )
}

export default function StoreHeader() {
  const location = useLocation()

  return (
    <header>
      <TopBar showAccount />
      <div id="header">
        <div className="container">
          <div className="row align-items-center gy-3">
            <div className="col-lg-3"><BrandLogo /></div>
            <div className="col-lg-6">
              <div className="header-search">
                {/* Cada ubicación reinicia el borrador desde su URL, incluido Back/Forward. */}
                <StoreSearchForm key={location.key} />
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
