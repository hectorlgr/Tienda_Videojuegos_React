import { useEffect, useId, useRef, useState } from 'react'
import { updateInventoryStock } from '../../services/inventoryService'

export default function StockEditor({ inventoryId, productName, stock, onUpdated }) {
  const [draft, setDraft] = useState(String(stock))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const pendingRef = useRef(false)
  const activeRef = useRef(false)
  const messageId = useId()
  const unchanged = draft.trim() !== '' && Number(draft) === stock

  useEffect(() => {
    activeRef.current = true
    return () => { activeRef.current = false }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    // La referencia bloquea también envíos antes del siguiente render.
    if (pendingRef.current) return

    const nextStock = Number(draft)
    if (draft.trim() === '' || !Number.isSafeInteger(nextStock) || nextStock < 0) {
      setError('Ingresa un stock válido: un entero mayor o igual a 0.')
      setSuccess(false)
      return
    }
    if (nextStock === stock) return

    pendingRef.current = true
    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      const updatedInventory = await updateInventoryStock(inventoryId, nextStock)
      if (!activeRef.current) return

      onUpdated(inventoryId, updatedInventory)
      setDraft(String(updatedInventory.stock))
      setSuccess(true)
    } catch {
      if (activeRef.current) setError('No fue posible actualizar el stock.')
    } finally {
      pendingRef.current = false
      if (activeRef.current) setSaving(false)
    }
  }

  return (
    <form className="admin-stock-editor" onSubmit={handleSubmit} noValidate aria-busy={saving}>
      <div className="d-flex align-items-center gap-2">
        <input
          type="number"
          min="0"
          step="1"
          max={Number.MAX_SAFE_INTEGER}
          className="form-control form-control-sm"
          aria-label={`Nuevo stock de ${productName}`}
          aria-describedby={messageId}
          aria-invalid={error ? true : undefined}
          value={draft}
          disabled={saving}
          onChange={event => {
            setDraft(event.target.value)
            setError('')
            setSuccess(false)
          }}
        />
        <button type="submit" className="btn btn-sm btn-primary" disabled={saving || unchanged}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
      <div id={messageId} className="small mt-1">
        {error && <p className="text-danger mb-0" role="alert">{error}</p>}
        <p className="text-success mb-0" role="status">{success ? 'Stock actualizado.' : ''}</p>
      </div>
    </form>
  )
}
