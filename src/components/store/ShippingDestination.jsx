import { useId } from 'react'
import { SHIPPING_REGIONS } from '../../config/shippingRegions'

export default function ShippingDestination({ regionId, comuna, onRegionChange, onComunaChange, errors = {} }) {
  const id = useId()
  const region = SHIPPING_REGIONS.find(option => option.id === regionId)

  return (
    <fieldset className="shipping-destination">
      <legend>Datos de envío</legend>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor={`${id}-region`}>Región</label>
          <select
            id={`${id}-region`}
            className={`form-select${errors.regionId ? ' is-invalid' : ''}`}
            value={regionId}
            aria-invalid={errors.regionId ? true : undefined}
            aria-describedby={errors.regionId ? `${id}-region-error` : undefined}
            onChange={event => onRegionChange(event.target.value)}
          >
            <option value="">Selecciona una región</option>
            {SHIPPING_REGIONS.map(option => (
              <option key={option.id} value={option.id}>{option.nombre}</option>
            ))}
          </select>
          {errors.regionId && <div id={`${id}-region-error`} className="invalid-feedback">{errors.regionId}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor={`${id}-comuna`}>Comuna</label>
          <select
            id={`${id}-comuna`}
            className={`form-select${errors.comuna ? ' is-invalid' : ''}`}
            aria-invalid={errors.comuna ? true : undefined}
            aria-describedby={errors.comuna ? `${id}-comuna-error` : undefined}
            value={comuna}
            disabled={!region}
            onChange={event => onComunaChange(event.target.value)}
          >
            <option value="">Selecciona una comuna</option>
            {region?.comunas.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
          {errors.comuna && <div id={`${id}-comuna-error`} className="invalid-feedback">{errors.comuna}</div>}
        </div>
      </div>
    </fieldset>
  )
}
