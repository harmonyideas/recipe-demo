// Recipe instructions are stored in the recipes.instructions text column as a
// JSON array of step strings, e.g. ["Heat the oven.", "Roast for 1 hour."].
// Older recipes stored plain text; parseSteps turns that into steps too, so
// both formats display and edit the same way.

// Matches a leading step number such as "1.", "2)", "3 -", "Step 4:" or "Step 5 -",
// but not quantities like "1.5 cups" or "2-3 minutes"
const NUMBER_PREFIX = /^\s*(?:step\s*)?\d+\s*[.):\-–](?!\d)\s*/i

export function parseSteps(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return []

  if (raw.trim().startsWith('[')) {
    try {
      const list = JSON.parse(raw)
      if (Array.isArray(list)) {
        return list.map((s) => (typeof s === 'string' ? s : String(s ?? ''))).filter((s) => s.trim() !== '')
      }
    } catch {
      // not JSON after all; fall through to plain text
    }
  }

  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean)
  const numbered = lines.some((l) => NUMBER_PREFIX.test(l))

  // Plain text without numbers: each line is a step
  if (!numbered) return lines

  // Numbered plain text: a numbered line starts a step, other lines continue it
  const steps = []
  for (const line of lines) {
    if (NUMBER_PREFIX.test(line) || steps.length === 0) {
      steps.push(line.replace(NUMBER_PREFIX, ''))
    } else {
      steps[steps.length - 1] += '\n' + line
    }
  }
  return steps.filter((s) => s.trim() !== '')
}

// Steps for the editor; always at least one box to type into
export function stepRowsFor(raw) {
  const steps = parseSteps(raw)
  return steps.length ? steps : ['']
}

// Turns editor steps into the string saved in the recipes.instructions column
export function serializeSteps(steps) {
  return JSON.stringify(steps.map((s) => s.trim()).filter(Boolean))
}
