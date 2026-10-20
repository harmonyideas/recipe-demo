import { parseStructuredIngredients } from '../utils/ingredients'

export default function IngredientsView({ raw }) {
  const rows = parseStructuredIngredients(raw)

  // Older recipes have plain text ingredients
  if (!rows) return <div className="pre-line">{raw}</div>
  if (rows.length === 0) return <span className="text-muted">None</span>

  return (
    <ul className="list-unstyled mb-0">
      {rows.map((r, i) => (
        <li key={i} className="mb-1">
          {[r.amount, r.unit === 'count' ? '' : r.unit, r.name].filter(Boolean).join(' ')}
          {r.type && (
            <span className={`badge ms-2 ${r.type === 'wet' ? 'text-bg-info' : 'text-bg-warning'}`}>
              {r.type === 'wet' ? 'Wet' : 'Dry'}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
