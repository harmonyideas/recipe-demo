// Units for each ingredient type. "count" covers whole items like "2 eggs".
// "custom" lets the user type their own unit, such as "clove" or "can".
export const DRY_UNITS = [
  { value: 'g', label: 'grams (g)' },
  { value: 'oz', label: 'ounces (oz)' },
  { value: 'lb', label: 'pounds (lb)' },
  { value: 'cup', label: 'cup' },
  { value: 'tbsp', label: 'tablespoon' },
  { value: 'tsp', label: 'teaspoon' },
  { value: 'pinch', label: 'pinch' },
  { value: 'count', label: 'whole / count' },
  { value: 'custom', label: 'Custom…' },
]

export const WET_UNITS = [
  { value: 'ml', label: 'milliliters (ml)' },
  { value: 'l', label: 'liters (l)' },
  { value: 'fl oz', label: 'fluid ounces (fl oz)' },
  { value: 'cup', label: 'cup' },
  { value: 'tbsp', label: 'tablespoon' },
  { value: 'tsp', label: 'teaspoon' },
  { value: 'count', label: 'whole / count' },
  { value: 'custom', label: 'Custom…' },
]

export function emptyIngredient() {
  return { name: '', amount: '', unit: '', customUnit: '', type: '' }
}

const KNOWN_UNITS = [...DRY_UNITS, ...WET_UNITS].map((u) => u.value)

// A stored unit that isn't in the lists is a custom unit
function fromStored(r) {
  const unit = r.unit ?? ''
  if (unit === '' || KNOWN_UNITS.includes(unit)) {
    return { name: r.name ?? '', amount: r.amount ?? '', unit, customUnit: '', type: r.type ?? '' }
  }
  return { name: r.name ?? '', amount: r.amount ?? '', unit: 'custom', customUnit: unit, type: r.type ?? '' }
}

// Returns the list of ingredients, or null if the stored value is not in the structured (JSON) format
export function parseStructuredIngredients(raw) {
  if (typeof raw !== 'string' || !raw.trim().startsWith('[')) return null
  try {
    const list = JSON.parse(raw)
    if (!Array.isArray(list)) return null
    return list.map(fromStored)
  } catch {
    return null
  }
}

// Rows for the editor. Older recipes stored ingredients as plain text, one per line,
// so each line becomes a row with only a name.
export function ingredientRowsFor(raw) {
  const structured = parseStructuredIngredients(raw)
  if (structured) return structured
  return (raw ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((name) => ({ ...emptyIngredient(), name }))
}

// Turns editor rows into the string saved in the recipes.ingredients column
export function serializeIngredients(rows) {
  return JSON.stringify(
    rows
      .map((r) => ({
        name: r.name.trim(),
        amount: r.amount.trim(),
        unit: r.unit === 'custom' ? (r.customUnit ?? '').trim() : r.unit,
        type: r.type,
      }))
      .filter((r) => r.name !== '')
  )
}
