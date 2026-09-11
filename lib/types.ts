export interface RawRecord {
  id: string | null
  name: string | null
  gender: string | null
  age: number | null
  dept: string | null
  title: string | null
  city: string | null
  salary: number | null
  marital: string | null
  edu: string | null
  perf: number | null
  attrition: string | null
  tenure: number | null
  overtime: string | null
  training: number | null
  manager: string | null
  workmode: string | null
  promo: string | null
  satisfaction: number | null
  status: string | null
}

export interface CleanRecord {
  id: string
  name: string | null
  gender: string | null
  age: number | null
  dept: string | null
  title: string | null
  city: string | null
  salary: number | null
  marital: string | null
  edu: string | null
  perf: number | null
  attrition: string | null
  tenure: number | null
  overtime: string | null
  training: number | null
  manager: string | null
  workmode: string | null
  everPromoted: number
  satisfaction: number | null
  status: string | null
}

export interface Model {
  w: number[]
  b: number
}

export interface Scaler {
  mean: number[]
  std: number[]
}

export interface Metrics {
  accuracy: number
  precision: number
  recall: number
  f1: number
  auc: number
  confusion: { tp: number; tn: number; fp: number; fn: number }
  nTest: number
  nTrain: number
  nLabeled: number
  posRate: number
}

export interface TrainedPipeline {
  model: Model
  scaler: Scaler
  featureNames: string[]
  metrics: Metrics
}

export interface PredictionInput {
  age: number
  dept: string
  tenure: number
  edu: string
  training: number
  marital: string
  perf: number
  workmode: string
  satisfaction: number
  gender: string
  overtime: string
  everPromoted: number
}
