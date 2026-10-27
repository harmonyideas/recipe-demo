import { parseSteps } from '../utils/steps'

export default function StepsView({ raw }) {
  const steps = parseSteps(raw)
  if (steps.length === 0) return <p className="text-muted mb-0">No instructions yet.</p>

  return (
    <ol className="recipe-steps">
      {steps.map((step, i) => (
        <li key={i} className="recipe-step">
          <span className="step-number" aria-hidden="true">{i + 1}</span>
          <div className="step-text">{step}</div>
        </li>
      ))}
    </ol>
  )
}
