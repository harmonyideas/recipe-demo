import { DRY_UNITS, WET_UNITS, emptyIngredient } from '../utils/ingredients'

export default function IngredientList({ value, onChange }) {
  const rows = value

  const update = (i, changes) =>
    onChange(rows.map((row, idx) => (idx === i ? { ...row, ...changes } : row)))
  const remove = (i) => onChange(rows.filter((_, idx) => idx !== i))
  const add = () => onChange([...rows, emptyIngredient()])

  return (
    <div>
      <div className="form-label">Ingredients</div>
      {rows.length === 0 && <p className="text-muted small">No ingredients yet.</p>}

      {rows.map((row, i) => {
        const units = row.type === 'wet' ? WET_UNITS : DRY_UNITS
        return (
          <div className="row g-2 align-items-center mb-2" key={i}>
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Ingredient"
                aria-label={`Ingredient ${i + 1} name`}
                value={row.name}
                onChange={(e) => update(i, { name: e.target.value })}
              />
            </div>
            <div className="col-4 col-md-2">
              <input
                className="form-control"
                placeholder="Amount"
                inputMode="decimal"
                aria-label={`Ingredient ${i + 1} amount`}
                value={row.amount}
                onChange={(e) => update(i, { amount: e.target.value })}
              />
            </div>
            <div className="col-4 col-md-2">
              <select
                className="form-select"
                aria-label={`Ingredient ${i + 1} type`}
                value={row.type}
                onChange={(e) => {
                  const type = e.target.value
                  const allowed = type === 'wet' ? WET_UNITS : DRY_UNITS
                  // keep the unit only if it still applies to the new type
                  update(i, { type, unit: allowed.some((u) => u.value === row.unit) ? row.unit : '' })
                }}
              >
                <option value="">Type</option>
                <option value="dry">Dry</option>
                <option value="wet">Wet</option>
              </select>
            </div>
            <div className="col-4 col-md-3">
              <select
                className="form-select"
                aria-label={`Ingredient ${i + 1} unit`}
                value={row.unit}
                onChange={(e) => update(i, { unit: e.target.value })}
              >
                <option value="">Unit</option>
                {units.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-1 text-end">
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                aria-label={`Remove ingredient ${i + 1}`}
                onClick={() => remove(i)}
              >
                ×
              </button>
            </div>
          </div>
        )
      })}

      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={add}>
        + Add ingredient
      </button>
    </div>
  )
}
