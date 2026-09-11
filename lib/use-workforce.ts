"use client"

import useSWR from "swr"
import { useMemo } from "react"
import { cleanRecord, trainModelPipeline } from "./analytics"
import type { RawRecord, CleanRecord, TrainedPipeline } from "./types"

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<RawRecord[]>)

export interface WorkforceData {
  raw: CleanRecord[]
  labeled: CleanRecord[]
  pipeline: TrainedPipeline | null
  isLoading: boolean
  error: unknown
}

export function useWorkforce(): WorkforceData {
  const { data, error, isLoading } = useSWR<RawRecord[]>("/data/employees.json", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const cleaned = useMemo(() => (data ? data.map(cleanRecord) : []), [data])

  const pipeline = useMemo(() => {
    if (!cleaned.length) return null
    try {
      return trainModelPipeline(cleaned)
    } catch {
      return null
    }
  }, [cleaned])

  const labeled = useMemo(
    () => cleaned.filter((d) => d.attrition === "Yes" || d.attrition === "No"),
    [cleaned],
  )

  return { raw: cleaned, labeled, pipeline, isLoading, error }
}
