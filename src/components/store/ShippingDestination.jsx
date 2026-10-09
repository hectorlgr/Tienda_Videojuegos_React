import { useId, useState } from 'react'
import { SHIPPING_REGIONS } from '../../config/shippingRegions'

export default function ShippingDestination() {
  const id = useId()
  const [regionId, setRegionId] = useState('')
  const [comuna, setComuna] = useState('')
  const region = SHIPPING_REGIONS.find(option => option.id === regionId)

  function changeRegion(event) {
    setRegionId(event.target.value)
    setComuna('')
  }

  return (
    <fieldset className="shipping-destination">
      <legend>Datos de envío</legend>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor={`${id}-region`}>Región</label>
          <select id={`${id}-region`} className="form-select" value={regionId} onChange={changeRegion}>
            <option value="">Selecciona una región</option>
            {SHIPPING_REGIONS.map(option => (
              <option key={option.id} value={option.id}>{option.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor={`${id}-comuna`}>Comuna</label>
          <select
            id={`${id}-comuna`}
            className="form-select"
            value={comuna}
            disabled={!region}
            onChange={event => setComuna(event.target.value)}
          >
            <option value="">Selecciona una comuna</option>
            {region?.comunas.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
      </div>
    </fieldset>
  )
}
