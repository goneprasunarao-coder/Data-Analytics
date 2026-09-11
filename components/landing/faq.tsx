const FAQS = [
  {
    q: "Where does the model run?",
    a: "Entirely in your browser. The dataset is loaded client-side, features are engineered on the fly, and the logistic-regression model is trained locally — no employee data is ever sent to a server.",
  },
  {
    q: "What algorithm powers the predictions?",
    a: "A regularized logistic-regression classifier trained with batch gradient descent and L2 penalty. It outputs a calibrated probability of attrition for each employee that you can threshold as you see fit.",
  },
  {
    q: "Can I use my own data?",
    a: "Yes. The Data Explorer accepts Excel and CSV uploads and maps common HR column names automatically, so most exports work without manual reshaping.",
  },
  {
    q: "How is model quality measured?",
    a: "On a held-out stratified test split, the platform reports accuracy, precision, recall, F1, and ROC-AUC alongside a full confusion matrix so you can judge reliability before trusting a score.",
  },
  {
    q: "Is this a replacement for an HRIS?",
    a: "No — it is an analytics and decision-support layer. It complements your HR system by turning exports into predictive insight and clear visualizations.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-[var(--color-border-soft)] py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-amber)]">
            FAQ
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
            Questions, answered
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-panel)] p-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-[family-name:var(--font-display)] text-base font-medium">
                {f.q}
                <span className="grid h-6 w-6 flex-none place-items-center rounded-full border border-[var(--color-border-strong)] text-[var(--color-text-muted)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
