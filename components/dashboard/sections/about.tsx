"use client"

import { Brain, Database, GitBranch, ShieldCheck, Workflow } from "lucide-react"
import { Panel } from "../ui/panel"

const PIPELINE = [
  {
    icon: Database,
    title: "Cleaning",
    body: "Category normalization, title casing, city corrections, and range validation on age, performance, tenure, salary, and satisfaction.",
  },
  {
    icon: Workflow,
    title: "Feature engineering",
    body: "Median imputation for numeric gaps, mode imputation for categoricals, one-hot encoding, and a derived ever-promoted signal.",
  },
  {
    icon: GitBranch,
    title: "Stratified split",
    body: "An 80/20 train/test split stratified on the attrition outcome preserves the base rate in both partitions.",
  },
  {
    icon: Brain,
    title: "Logistic regression",
    body: "Batch gradient descent with L2 regularization over standardized features, producing calibrated attrition probabilities.",
  },
]

export function AboutSection() {
  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)]">
            <ShieldCheck className="h-6 w-6 text-white" />
          </span>
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
              About Workforce Signal
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Workforce Signal is a self-contained analytics platform for understanding and
              predicting employee attrition. Every stage — from data cleaning through model training
              and scoring — runs entirely in your browser. No employee record is ever transmitted to
              a server, making it safe to explore sensitive people data.
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="The modeling pipeline" subtitle="Transparent, inspectable, and fully client-side">
        <div className="grid gap-4 sm:grid-cols-2">
          {PIPELINE.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-deep)] p-5"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-border-strong)] text-[var(--color-accent)]">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-base font-semibold">
                {p.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="How to read the predictions">
          <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[var(--color-rose)]" />
              Scores are probabilities between 0 and 1 — the model&apos;s estimated likelihood that an
              employee with those attributes leaves.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[var(--color-amber)]" />
              Risk bands (Low / Moderate / High) are convenience thresholds; tune them to your own
              tolerance for false positives.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[var(--color-teal)]" />
              Contributing factors show standardized coefficient effects for the current profile, not
              causal claims.
            </li>
          </ul>
        </Panel>

        <Panel title="Responsible use">
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Attrition predictions are decision-support signals, not verdicts. They should complement
            conversations with managers and employees — never replace them. Avoid using individual
            scores for punitive action; the greatest value is in spotting systemic patterns and
            improving retention programs across teams.
          </p>
        </Panel>
      </div>
    </div>
  )
}
