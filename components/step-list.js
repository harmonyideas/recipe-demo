import { useEffect, useRef } from 'react'

function autoGrow(el) {
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight + 2}px`
}

// Editor for recipe instructions: one numbered box per step
export default function StepList({ value, onChange }) {
  const steps = value
  const boxes = useRef([])
  const focusIndex = useRef(null)

  // After adding a step, put the cursor in it
  useEffect(() => {
    if (focusIndex.current !== null) {
      boxes.current[focusIndex.current]?.focus()
      focusIndex.current = null
    }
  })

  // Grow each box to fit its text, so long steps are never cut off
  useEffect(() => {
    const fit = () => boxes.current.slice(0, steps.length).forEach(autoGrow)
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  })

  const update = (i, text) => onChange(steps.map((s, idx) => (idx === i ? text : s)))
  const remove = (i) => onChange(steps.length === 1 ? [''] : steps.filter((_, idx) => idx !== i))
  const insertAfter = (i) => {
    focusIndex.current = i + 1
    onChange([...steps.slice(0, i + 1), '', ...steps.slice(i + 1)])
  }
  const move = (i, delta) => {
    const j = i + delta
    if (j < 0 || j >= steps.length) return
    const next = [...steps]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div>
      <div className="form-label">Instructions</div>

      <ol className="step-editor">
        {steps.map((step, i) => (
          <li className="step-editor-row" key={i}>
            <span className="step-number" aria-hidden="true">{i + 1}</span>
            <textarea
              ref={(el) => (boxes.current[i] = el)}
              className="form-control step-input"
              rows={1}
              placeholder={i === 0 ? 'e.g. Heat the oven to 425°F.' : 'Next step'}
              aria-label={`Step ${i + 1}`}
              value={step}
              onChange={(e) => update(i, e.target.value)}
              onKeyDown={(e) => {
                // Ctrl/Cmd+Enter starts a new step below this one
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault()
                  insertAfter(i)
                }
              }}
            />
            <div className="step-actions">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                aria-label={`Move step ${i + 1} up`}
                title="Move up"
                disabled={i === 0}
                onClick={() => move(i, -1)}
              >
                ↑
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                aria-label={`Move step ${i + 1} down`}
                title="Move down"
                disabled={i === steps.length - 1}
                onClick={() => move(i, 1)}
              >
                ↓
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                aria-label={`Remove step ${i + 1}`}
                title="Remove step"
                onClick={() => remove(i)}
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ol>

      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => insertAfter(steps.length - 1)}>
        + Add step
      </button>
      <span className="form-text ms-2">Tip: Ctrl+Enter adds a step below the one you&apos;re typing in.</span>
    </div>
  )
}
