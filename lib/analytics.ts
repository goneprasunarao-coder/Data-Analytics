import type {
  RawRecord,
  CleanRecord,
  Model,
  Scaler,
  Metrics,
  TrainedPipeline,
  PredictionInput,
} from "./types"

/* ---------------------------------------------------------------------
   CONSTANTS
   --------------------------------------------------------------------- */
export const NUM_FEATS = ["age", "tenure", "training", "satisfaction", "perf"] as const

export const CAT_LEVELS: Record<string, string[]> = {
  dept: ["Engineering", "Finance", "HR", "IT", "Legal", "Marketing", "Operations", "Procurement", "Sales"],
  edu: ["Diploma", "High School", "Masters", "PhD"],
  marital: ["Married", "Single", "Widowed"],
  workmode: ["Onsite", "Remote"],
  gender: ["Male"],
  overtime: ["Yes"],
}

const PREFIX_LABEL: Record<string, string> = {
  dept: "Department",
  edu: "Education",
  marital: "Marital status",
  workmode: "Work mode",
  gender: "Gender",
}

const NUM_LABEL: Record<string, string> = {
  age: "Age",
  tenure: "Years at company",
  training: "Training hours (last yr)",
  satisfaction: "Satisfaction score",
  perf: "Performance rating",
  everPromoted: "Ever promoted",
}

export const HEADER_ALIASES: Record<string, string[]> = {
  id: ["employeeid", "empid", "id"],
  name: ["fullname", "name", "employeename"],
  gender: ["gender", "sex"],
  age: ["age"],
  dept: ["department", "dept"],
  title: ["jobtitle", "title", "designation"],
  city: ["city", "location"],
  salary: ["salary", "ctc", "compensation", "annualsalary"],
  marital: ["maritalstatus", "marital"],
  edu: ["educationlevel", "education", "edu"],
  perf: ["performancerating", "performance", "perf"],
  attrition: ["attrition", "left", "churn"],
  tenure: ["yearsatcompany", "tenure", "experience"],
  overtime: ["overtime"],
  training: ["traininghourslastyear", "traininghours", "training"],
  manager: ["managername", "manager"],
  workmode: ["workmode", "mode"],
  promo: ["promotiondate", "promodate", "promotion"],
  satisfaction: ["satisfactionscore", "satisfaction"],
  status: ["employmentstatus", "status"],
}

/* ---------------------------------------------------------------------
   CLEANING
   --------------------------------------------------------------------- */
function normCat(s: unknown): string | null {
  if (s === null || s === undefined) return null
  const t = String(s).trim()
  return t === "" ? null : t
}

function titleFix(s: string | null): string | null {
  if (s === null) return null
  const t = s.trim()
  const lower = t.toLowerCase()
  const special: Record<string, string> = { it: "IT", hr: "HR" }
  if (special[lower]) return special[lower]
  return t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase())
}

function cityFix(s: string | null): string | null {
  if (s === null) return null
  const t = s.trim()
  return t === "Banglore" ? "Bengaluru" : t
}

function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null
  const n = Number(v)
  return isNaN(n) ? null : n
}

export function cleanRecord(r: RawRecord): CleanRecord {
  const ageRaw = toNum(r.age)
  const perfRaw = toNum(r.perf)
  const trainingRaw = toNum(r.training)
  const salaryRaw = toNum(r.salary)
  const satisfactionRaw = toNum(r.satisfaction)
  const tenureRaw = toNum(r.tenure)
  const age = ageRaw !== null && ageRaw >= 18 && ageRaw <= 70 ? ageRaw : null
  const perf = perfRaw !== null && perfRaw >= 1 && perfRaw <= 5 ? perfRaw : null
  const training = trainingRaw !== null && trainingRaw >= 0 ? trainingRaw : null
  const salary = salaryRaw !== null && salaryRaw > 0 ? salaryRaw : null
  const satisfaction = satisfactionRaw !== null && satisfactionRaw >= 1 && satisfactionRaw <= 5 ? satisfactionRaw : null
  const tenure = tenureRaw !== null && tenureRaw >= 0 ? tenureRaw : null
  const promo = normCat(r.promo)
  const everPromoted = promo === null || promo === "Never Promoted" ? 0 : 1
  const attritionNorm = normCat(r.attrition)
  return {
    id: normCat(r.id) || "R" + Math.random().toString(36).slice(2, 9),
    name: normCat(r.name),
    gender: normCat(r.gender),
    age,
    dept: titleFix(normCat(r.dept)),
    title: normCat(r.title),
    city: cityFix(normCat(r.city)),
    salary,
    marital: titleFix(normCat(r.marital)),
    edu: normCat(r.edu),
    perf,
    attrition: attritionNorm,
    tenure,
    overtime: normCat(r.overtime),
    training,
    manager: normCat(r.manager),
    workmode: titleFix(normCat(r.workmode)),
    everPromoted,
    satisfaction,
    status: normCat(r.status),
  }
}

/* ---------------------------------------------------------------------
   FEATURE ENGINEERING + MODEL
   --------------------------------------------------------------------- */
function median(arr: number[]): number {
  const s = arr.slice().sort((a, b) => a - b)
  const n = s.length
  if (!n) return 0
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2
}

function mode<T>(arr: T[]): T | null {
  const c = new Map<T, number>()
  let best: T | null = null
  let bestC = -1
  for (const v of arr) {
    const next = (c.get(v) || 0) + 1
    c.set(v, next)
    if (next > bestC) {
      bestC = next
      best = v
    }
  }
  return best
}

function buildDataset(labeled: CleanRecord[]) {
  const impute: Record<string, number> = {}
  for (const f of NUM_FEATS) {
    impute[f] = median(labeled.map((d) => d[f]).filter((v): v is number => v !== null))
  }
  const catImpute: Record<string, string | null> = {}
  for (const f of Object.keys(CAT_LEVELS)) {
    catImpute[f] = mode(labeled.map((d) => (d as any)[f]).filter((v): v is string => Boolean(v)))
  }
  const featureNames: string[] = [...NUM_FEATS, "everPromoted"]
  for (const f of Object.keys(CAT_LEVELS)) for (const lvl of CAT_LEVELS[f]) featureNames.push(f + "_" + lvl)

  function vectorize(d: CleanRecord): number[] {
    const vec: number[] = []
    for (const f of NUM_FEATS) vec.push(d[f] !== null && d[f] !== undefined ? (d[f] as number) : impute[f])
    vec.push(d.everPromoted || 0)
    for (const f of Object.keys(CAT_LEVELS)) {
      const val = (d as any)[f] || catImpute[f]
      for (const lvl of CAT_LEVELS[f]) vec.push(val === lvl ? 1 : 0)
    }
    return vec
  }
  const X = labeled.map(vectorize)
  const y = labeled.map((d) => (d.attrition === "Yes" ? 1 : 0))
  return { X, y, featureNames, impute, catImpute }
}

function standardize(X: number[][]) {
  const n = X.length
  const m = X[0].length
  const mean = new Array(m).fill(0)
  const std = new Array(m).fill(0)
  for (let j = 0; j < m; j++) {
    let s = 0
    for (let i = 0; i < n; i++) s += X[i][j]
    mean[j] = s / n
  }
  for (let j = 0; j < m; j++) {
    let s = 0
    for (let i = 0; i < n; i++) s += (X[i][j] - mean[j]) ** 2
    std[j] = Math.sqrt(s / n) || 1
  }
  const Xs = X.map((row) => row.map((v, j) => (v - mean[j]) / std[j]))
  return { Xs, mean, std }
}

export function applyScale(vec: number[], mean: number[], std: number[]): number[] {
  return vec.map((v, j) => (v - mean[j]) / std[j])
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function stratifiedSplit(y: number[], testFrac: number, seed: number) {
  const idx0: number[] = []
  const idx1: number[] = []
  y.forEach((v, i) => (v === 1 ? idx1.push(i) : idx0.push(i)))
  const s0 = seededShuffle(idx0, seed)
  const s1 = seededShuffle(idx1, seed + 1)
  const t0 = Math.round(s0.length * testFrac)
  const t1 = Math.round(s1.length * testFrac)
  return {
    trainIdx: s0.slice(t0).concat(s1.slice(t1)),
    testIdx: s0.slice(0, t0).concat(s1.slice(0, t1)),
  }
}

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z))
}

function trainLogReg(X: number[][], y: number[], opts: { lr?: number; epochs?: number; l2?: number } = {}): Model {
  const lr = opts.lr || 0.3
  const epochs = opts.epochs || 1200
  const l2 = opts.l2 !== undefined ? opts.l2 : 0.5
  const n = X.length
  const m = X[0].length
  const w = new Array(m).fill(0)
  let b = 0
  for (let e = 0; e < epochs; e++) {
    const gradW = new Array(m).fill(0)
    let gradB = 0
    for (let i = 0; i < n; i++) {
      let z = b
      for (let j = 0; j < m; j++) z += w[j] * X[i][j]
      const p = sigmoid(z)
      const err = p - y[i]
      for (let j = 0; j < m; j++) gradW[j] += err * X[i][j]
      gradB += err
    }
    for (let j = 0; j < m; j++) w[j] -= lr * (gradW[j] / n + (l2 / n) * w[j])
    b -= lr * (gradB / n)
  }
  return { w, b }
}

export function predictProba(model: Model, x: number[]): number {
  let z = model.b
  for (let j = 0; j < x.length; j++) z += model.w[j] * x[j]
  return sigmoid(z)
}

function evaluate(model: Model, Xte: number[][], yte: number[], threshold = 0.5) {
  let tp = 0
  let tn = 0
  let fp = 0
  let fn = 0
  const probs = Xte.map((x) => predictProba(model, x))
  probs.forEach((p, i) => {
    const pred = p >= threshold ? 1 : 0
    if (pred === 1 && yte[i] === 1) tp++
    else if (pred === 0 && yte[i] === 0) tn++
    else if (pred === 1 && yte[i] === 0) fp++
    else fn++
  })
  const accuracy = (tp + tn) / (tp + tn + fp + fn) || 0
  const precision = tp / (tp + fp) || 0
  const recall = tp / (tp + fn) || 0
  const f1 = (2 * precision * recall) / (precision + recall) || 0
  const paired = probs.map((p, i) => [p, yte[i]] as [number, number]).sort((a, b) => a[0] - b[0])
  const ranks = new Array(paired.length)
  let i = 0
  while (i < paired.length) {
    let j = i
    while (j < paired.length && paired[j][0] === paired[i][0]) j++
    const avg = (i + 1 + j) / 2
    for (let k = i; k < j; k++) ranks[k] = avg
    i = j
  }
  let sumRankPos = 0
  let nPos = 0
  let nNeg = 0
  paired.forEach((p, idx) => {
    if (p[1] === 1) {
      sumRankPos += ranks[idx]
      nPos++
    } else nNeg++
  })
  const auc = nPos && nNeg ? (sumRankPos - (nPos * (nPos + 1)) / 2) / (nPos * nNeg) : 0.5
  return { accuracy, precision, recall, f1, auc, confusion: { tp, tn, fp, fn }, nTest: Xte.length }
}

export function trainModelPipeline(data: CleanRecord[]): TrainedPipeline {
  const labeled = data.filter((d) => d.attrition === "Yes" || d.attrition === "No")
  const ds = buildDataset(labeled)
  const { Xs, mean, std } = standardize(ds.X)
  const { trainIdx, testIdx } = stratifiedSplit(ds.y, 0.2, 42)
  const Xtr = trainIdx.map((i) => Xs[i])
  const ytr = trainIdx.map((i) => ds.y[i])
  const Xte = testIdx.map((i) => Xs[i])
  const yte = testIdx.map((i) => ds.y[i])
  const model = trainLogReg(Xtr, ytr, { lr: 0.3, epochs: 1200, l2: 0.5 })
  const evalResult = evaluate(model, Xte, yte)
  const metrics: Metrics = {
    ...evalResult,
    nTrain: Xtr.length,
    nLabeled: labeled.length,
    posRate: ds.y.reduce((a: number, b) => a + b, 0) / ds.y.length,
  }
  return { model, scaler: { mean, std }, featureNames: ds.featureNames, metrics }
}

export function vectorizeForPrediction(input: PredictionInput): number[] {
  const vec: number[] = []
  vec.push(input.age, input.tenure, input.training, input.satisfaction, input.perf)
  vec.push(input.everPromoted)
  for (const f of Object.keys(CAT_LEVELS)) {
    const val = (input as any)[f]
    for (const lvl of CAT_LEVELS[f]) vec.push(val === lvl ? 1 : 0)
  }
  return vec
}

export function featureLabel(name: string): string {
  if (NUM_LABEL[name]) return NUM_LABEL[name]
  const us = name.indexOf("_")
  if (us === -1) return name
  const prefix = name.slice(0, us)
  const level = name.slice(us + 1)
  if (prefix === "overtime") return "Works overtime"
  return (PREFIX_LABEL[prefix] || prefix) + ": " + level
}

/* ---------------------------------------------------------------------
   UPLOAD HEADER MAPPING
   --------------------------------------------------------------------- */
function normalizeHeader(h: string): string {
  return String(h).toLowerCase().replace(/[\s_-]/g, "")
}

export function mapRowsFromSheet(rows: Record<string, unknown>[]): RawRecord[] {
  if (!rows.length) return []
  const rawHeaders = Object.keys(rows[0])
  const headerMap: Record<string, string> = {}
  for (const key in HEADER_ALIASES) {
    for (const raw of rawHeaders) {
      if (HEADER_ALIASES[key].includes(normalizeHeader(raw))) {
        headerMap[key] = raw
        break
      }
    }
  }
  return rows.map((r) => {
    const rec: Record<string, unknown> = {}
    for (const key in HEADER_ALIASES) rec[key] = headerMap[key] ? r[headerMap[key]] : null
    if (rec.promo instanceof Date) rec.promo = (rec.promo as Date).toISOString().slice(0, 10)
    return rec as unknown as RawRecord
  })
}

/* ---------------------------------------------------------------------
   HELPERS
   --------------------------------------------------------------------- */
export function uniqueSorted(data: CleanRecord[], field: keyof CleanRecord): string[] {
  return [...new Set(data.map((d) => d[field]).filter(Boolean) as string[])].sort()
}

export const fmtInt = (n: number) => n.toLocaleString("en-IN")
export const fmtPct = (n: number) => (n * 100).toFixed(1) + "%"
export const fmtMoney = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN")
export const fmtNum1 = (n: number) => n.toFixed(1)
