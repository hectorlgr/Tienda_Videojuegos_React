import { useId, useState } from 'react'

export default function QuantitySelector({ value, onChange, min = 1, max, disabled = false }) {
  const inputId = useId()
  // El borrador permite borrar y escribir; onChange solo comunica enteros válidos.
  const [draft, setDraft] = useState({ value, min, max, disabled, text: String(value) })

  if (draft.value !== value || draft.min !== min || draft.max !== max || draft.disabled !== disabled) {
    setDraft({ value, min, max, disabled, text: String(value) })
  }

  function commit(rawValue) {
    if (disabled) return
    const number = Number(rawValue)
    const next = Number.isFinite(number) ? Math.min(max, Math.max(min, Math.trunc(number))) : min
    setDraft({ value, min, max, disabled, text: String(next) })
    onChange(next)
  }

  return (
    <div className="quantity-selector">
      <label htmlFor={inputId}>Cantidad</label>
      <div className="input-number">
        <input
          id={inputId}
          type="number"
          min={min}
          max={max}
          step="1"
          value={draft.text}
          disabled={disabled}
          onChange={event => setDraft({ ...draft, text: event.target.value })}
          onBlur={() => commit(draft.text)}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault()
              commit(draft.text)
            }
          }}
        />
        <button
          className="qty-up"
          type="button"
          aria-label="Aumentar cantidad"
          disabled={disabled || value >= max}
          onClick={() => commit(value + 1)}
        >+</button>
        <button
          className="qty-down"
          type="button"
          aria-label="Disminuir cantidad"
          disabled={disabled || value <= min}
          onClick={() => commit(value - 1)}
        >−</button>
      </div>
    </div>
  )
}
