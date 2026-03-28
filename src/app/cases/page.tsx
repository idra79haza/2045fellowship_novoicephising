"use client";

import { useState } from "react";
import Link from "next/link";
import {
  YEARLY_STATS,
  SCAM_TYPE_STATS,
  SCENARIOS,
  KEY_STATS,
} from "@/lib/scenarios";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
  ArrowRight,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
} from "lucide-react";

const KEY_STAT_CARDS = [
  {
    label: "연간 피해액 (2025)",
    value: KEY_STATS.yearlyLoss,
    suffix: "원",
    icon: <DollarSign className="w-6 h-6" />,
    color: "text-danger-600",
    bg: "bg-danger-50",
    border: "border-danger-200",
  },
  {
    label: "하루 평균 피해자",
    value: `${KEY_STATS.dailyVictims}`,
    suffix: "명",
    icon: <Users className="w-6 h-6" />,
    color: "text-warning-600",
    bg: "bg-warning-50",
    border: "border-warning-200",
  },
  {
    label: "피해금 회수율",
    value: KEY_STATS.recoveryRate,
    suffix: "",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "text-primary-600",
    bg: "bg-primary-50",
    border: "border-primary-200",
  },
  {
    label: "미신고 비율",
    value: KEY_STATS.unreportedRate,
    suffix: "",
    icon: <AlertTriangle className="w-6 h-6" />,
    color: "text-navy-600",
    bg: "bg-navy-50",
    border: "border-navy-200",
  },
];

const AGE_DATA = [
  { age: "20대", percentage: 8, color: "#60A5FA" },
  { age: "30대", percentage: 14, color: "#3B82F6" },
  { age: "40대", percentage: 19, color: "#2563EB" },
  { age: "50대", percentage: 28, color: "#DC2626" },
  { age: "60대", percentage: 22, color: "#EF4444" },
  { age: "70대+", percentage: 9, color: "#F87171" },
];

export default function CasesPage() {
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 animate-[slide-up_0.6s_ease-out]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-danger-50 text-danger-700 rounded-full text-sm font-medium mb-4">
            <BarChart3 className="w-4 h-4" />
            실제 데이터 기반
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">
            보이스피싱, 숫자로 보는 현실
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            매년 수만 명이 보이스피싱 피해를 겪고 있습니다.
            <br className="hidden sm:block" />
            데이터가 말하는 심각성을 확인하세요.
          </p>
        </header>

        {/* Key Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {KEY_STAT_CARDS.map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} border ${stat.border} rounded-2xl p-5 text-center card-hover`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm mb-3 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className={`text-2xl md:text-3xl font-extrabold ${stat.color} stat-number`}>
                {stat.value}
                <span className="text-base font-medium">{stat.suffix}</span>
              </div>
              <p className="text-xs md:text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Yearly Trend Chart */}
        <section className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-navy-900 mb-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            연도별 피해 추이
          </h2>
          <p className="text-sm text-slate-400 mb-6">2019 ~ 2025년 보이스피싱 건수 및 피해액</p>

          <div className="h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={YEARLY_STATS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="casesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                />
                <YAxis
                  yAxisId="loss"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}조`}
                  domain={[0, "auto"]}
                />
                <YAxis
                  yAxisId="cases"
                  orientation="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  tickFormatter={(v: number) => `${(v / 10000).toFixed(1)}만`}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "13px",
                  }}
                  formatter={(value, name) => {
                    const v = Number(value);
                    if (name === "totalLoss") return [`${v.toLocaleString()}억원`, "피해액"];
                    return [`${v.toLocaleString()}건`, "발생 건수"];
                  }}
                  labelFormatter={(label) => `${label}년`}
                />
                <Area
                  yAxisId="cases"
                  type="monotone"
                  dataKey="cases"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#casesGradient)"
                  dot={{ fill: "#3B82F6", r: 4 }}
                  activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
                />
                <Area
                  yAxisId="loss"
                  type="monotone"
                  dataKey="totalLoss"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fill="url(#lossGradient)"
                  dot={{ fill: "#EF4444", r: 4 }}
                  activeDot={{ r: 6, stroke: "#EF4444", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-500">발생 건수</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-danger-500" />
              <span className="text-slate-500">피해액 (억원)</span>
            </div>
          </div>
        </section>

        {/* Scam Types Breakdown */}
        <section className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-navy-900 mb-1 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary-600" />
            유형별 비중
          </h2>
          <p className="text-sm text-slate-400 mb-6">2025년 보이스피싱 유형 분포</p>

          <div className="h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SCAM_TYPE_STATS}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                  tickFormatter={(v: number) => `${v}%`}
                  domain={[0, 40]}
                />
                <YAxis
                  type="category"
                  dataKey="type"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#334155", fontSize: 13 }}
                  width={140}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "13px",
                  }}
                  formatter={(value) => [`${value}%`, "비중"]}
                />
                <Bar dataKey="percentage" radius={[0, 8, 8, 0]} barSize={24}>
                  {SCAM_TYPE_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Age Distribution */}
        <section className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-navy-900 mb-1 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-600" />
            연령대별 피해 분포
          </h2>
          <p className="text-sm text-slate-400 mb-6">50~60대가 전체 피해의 절반을 차지합니다</p>

          <div className="space-y-3">
            {AGE_DATA.map((item) => (
              <div key={item.age} className="flex items-center gap-4">
                <span className="w-14 text-sm font-medium text-slate-600 text-right">{item.age}</span>
                <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full rounded-lg transition-all duration-1000 ease-out flex items-center"
                    style={{ width: `${(item.percentage / 30) * 100}%`, backgroundColor: item.color }}
                  >
                    <span className="text-xs font-bold text-white ml-3 drop-shadow-sm">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                {(item.age === "50대" || item.age === "60대") && (
                  <span className="text-xs font-medium text-danger-600 bg-danger-50 px-2 py-0.5 rounded-full flex-shrink-0">
                    고위험
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-danger-50 border border-danger-200 rounded-xl">
            <p className="text-sm text-danger-800 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              50~60대 피해자가 전체의 50%를 차지하며, 1건당 평균 피해액도 가장 높습니다.
            </p>
          </div>
        </section>

        {/* Real Cases */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-primary-600" />
            실제 피해 사례
          </h2>

          <div className="space-y-4">
            {SCENARIOS.map((scenario) => {
              const isExpanded = expandedCase === scenario.id;
              return (
                <div
                  key={scenario.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setExpandedCase(isExpanded ? null : scenario.id)}
                    className="w-full text-left p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: scenario.bgColor }}
                    >
                      {scenario.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-navy-900 text-sm md:text-base">
                        {scenario.realCase.title}
                      </h3>
                      <span className="text-danger-600 font-bold text-lg">
                        {scenario.realCase.loss}
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-0 border-t border-slate-100 animate-[fade-in_0.3s_ease-out]">
                      <p className="text-slate-600 text-sm leading-relaxed mt-4 mb-3">
                        {scenario.realCase.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {scenario.realCase.source} ({scenario.realCase.year})
                        </span>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: scenario.bgColor,
                            color: scenario.color,
                          }}
                        >
                          {scenario.title}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-8 md:p-12 mb-8">
          <div className="text-4xl mb-4">{"\u26A0\uFE0F"}</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            당신도 피해자가 될 수 있습니다
          </h2>
          <p className="text-slate-300 mb-8 max-w-md mx-auto">
            보이스피싱은 누구에게나 일어날 수 있습니다.
            <br />
            시뮬레이션으로 미리 대비하세요.
          </p>
          <Link
            href="/simulation"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-navy-900 font-semibold rounded-2xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <Shield className="w-5 h-5" />
            체험 시뮬레이션 시작
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
