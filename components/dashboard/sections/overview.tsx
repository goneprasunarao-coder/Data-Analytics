"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Area,
  AreaChart,
} from "recharts"
import { Users, TrendingDown, Gauge, Wallet, Building2, Clock } from "lucide-react"
import { StatCard } from "../ui/stat-card"
import { Panel } from "../ui/panel"
import { CHART, PIE_COLORS, tooltipStyle } from "../ui/chart-theme"
import { fmtInt, fmtPct, fmtMoney, fmtNum1 } from "@/lib/analytics"
import type { CleanRecord } from "@/lib/types"

function attritionRate(rows: CleanRecord[]) {
  const labeled = rows.filter((d) => d.attrition === "Yes" || d.attrition === "No")
  if (!labeled.length) return 0
  return labeled.filter((d) => d.attrition === "Yes").length / labeled.length
}

export function Overview({ data }: { data: CleanRecord[] }) {
  const stats = useMemo(() => {
    const labeled = data.filter((d) => d.attrition === "Yes" || d.attrition === "No")
    const sats = data.map((d) => d.satisfaction).filter((v): v is number => v !== null)
    const sals = data.map((d) => d.salary).filter((v): v is number => v !== null)
    const depts = new Set(data.map((d) => d.dept).filter(Boolean))
    const tenures = data.map((d) => d.tenure).filter((v): v is number => v !== null)
    return {
      headcount: data.length,
      attrition: attritionRate(data),
      leavers: labeled.filter((d) => d.attrition === "Yes").length,
      avgSat: sats.reduce((a, b) => a + b, 0) / (sats.length || 1),
      avgSalary: sals.reduce((a, b) => a + b, 0) / (sals.length || 1),
      depts: depts.size,
      avgTenure: tenures.reduce((a, b) => a + b, 0) / (tenures.length || 1),
    }
  }, [data])

  const byDept = useMemo(() => {
    const map = new Map<string, CleanRecord[]>()
    for (const d of data) {
      if (!d.dept) continue
      if (!map.has(d.dept)) map.set(d.dept, [])
      map.get(d.dept)!.push(d)
    }
    return [...map.entries()]
      .map(([dept, rows]) => ({
        dept,
        rate: +(attritionRate(rows) * 100).toFixed(1),
        headcount: rows.length,
      }))
      .sort((a, b) => b.rate - a.rate)
  }, [data])

  const byTenure = useMemo(() => {
    const buckets = [
      { label: "0-2y", min: 0, max: 2 },
      { label: "2-5y", min: 2, max: 5 },
      { label: "5-8y", min: 5, max: 8 },
      { label: "8-12y", min: 8, max: 12 },
      { label: "12y+", min: 12, max: Infinity },
    ]
    return buckets.map((b) => {
      const rows = data.filter((d) => d.tenure !== null && d.tenure >= b.min && d.tenure < b.max)
      return { label: b.label, rate: +(attritionRate(rows) * 100).toFixed(1), headcount: rows.length }
    })
  }, [data])

  const satDist = useMemo(() => {
    const counts = [1, 2, 3, 4, 5].map((s) => ({
      score: `${s}`,
      count: data.filter((d) => d.satisfaction === s).length,
    }))
    return counts
  }, [data])

  const workmode = useMemo(() => {
    const map = new Map<string, number>()
    for (const d of data) {
      const key = d.workmode || "Unknown"
      map.set(key, (map.get(key) || 0) + 1)
    }
    return [...map.entries()].map(([name, value]) => ({ name, value }))
  }, [data])

  const ageDist = useMemo(() => {
    const buckets = ["18-25", "26-32", "33-40", "41-50", "51+"]
    const ranges = [
      [18, 25],
      [26, 32],
      [33, 40],
      [41, 50],
      [51, 120],
    ]
    return buckets.map((label, i) => ({
      label,
      count: data.filter(
        (d) => d.age !== null && d.age >= ranges[i][0] && d.age <= ranges[i][1],
      ).length,
    }))
  }, [data])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Users} label="Headcount" value={fmtInt(stats.headcount)} tone="blue" />
        <StatCard
          icon={TrendingDown}
          label="Attrition rate"
          value={fmtPct(stats.attrition)}
          sub={`${fmtInt(stats.leavers)} leavers`}
          tone="rose"
        />
        <StatCard
          icon={Gauge}
          label="Avg satisfaction"
          value={`${fmtNum1(stats.avgSat)} / 5`}
          tone="teal"
        />
        <StatCard icon={Wallet} label="Avg salary" value={fmtMoney(stats.avgSalary)} tone="green" />
        <StatCard icon={Building2} label="Departments" value={fmtInt(stats.depts)} tone="amber" />
        <StatCard
          icon={Clock}
          label="Avg tenure"
          value={`${fmtNum1(stats.avgTenure)}y`}
          tone="accent"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel
          title="Attrition rate by department"
          subtitle="Share of employees who left, per department"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byDept} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
              <XAxis
                dataKey="dept"
                tick={{ fill: CHART.axis, fontSize: 11 }}
                axisLine={{ stroke: CHART.grid }}
                tickLine={false}
                angle={-20}
                textAnchor="end"
                height={54}
              />
              <YAxis
                tick={{ fill: CHART.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(139,124,246,0.08)" }} />
              <Bar dataKey="rate" name="Attrition %" radius={[6, 6, 0, 0]}>
                {byDept.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Work mode" subtitle="Distribution of work arrangements">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={workmode}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
              >
                {workmode.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke={CHART.panel} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: CHART.axis }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Attrition by tenure" subtitle="Risk across time at company">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={byTenure} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="tenureFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.rose} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={CHART.rose} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: CHART.axis, fontSize: 11 }}
                axisLine={{ stroke: CHART.grid }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: CHART.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: CHART.rose }} />
              <Area
                type="monotone"
                dataKey="rate"
                name="Attrition %"
                stroke={CHART.rose}
                strokeWidth={2.5}
                fill="url(#tenureFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Satisfaction distribution" subtitle="Employee-reported scores">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={satDist} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
              <XAxis
                dataKey="score"
                tick={{ fill: CHART.axis, fontSize: 11 }}
                axisLine={{ stroke: CHART.grid }}
                tickLine={false}
              />
              <YAxis tick={{ fill: CHART.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(45,212,191,0.08)" }} />
              <Bar dataKey="count" name="Employees" fill={CHART.teal} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Age distribution" subtitle="Workforce by age band">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ageDist} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: CHART.axis, fontSize: 11 }}
                axisLine={{ stroke: CHART.grid }}
                tickLine={false}
              />
              <YAxis tick={{ fill: CHART.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(91,141,239,0.08)" }} />
              <Bar dataKey="count" name="Employees" fill={CHART.blue} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  )
}
