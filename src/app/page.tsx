"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  KEY_STATS,
  YEARLY_STATS,
  SCAM_TYPE_STATS,
  SCENARIOS,
} from "@/lib/scenarios";
import {
  SCENARIO_TYPE_LABELS,
  DIFFICULTY_LABELS,
  type Difficulty,
} from "@/lib/types";

/* ─── Counter Hook (IntersectionObserver + animation) ── */
function useCountUp(
  end: number,
  duration: number = 2000,
  suffix: string = "",
  prefix: string = ""
) {
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * end);
            setDisplay(`${prefix}${current.toLocaleString()}${suffix}`);
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, suffix, prefix]);

  return { ref, display };
}

/* ─── Intersection Observer for slide-up animations ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ─── Animated Daily Victims Counter ─────────────── */
function DailyVictimsCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = KEY_STATS.dailyVictims;
    const duration = 2500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <span className="text-6xl sm:text-7xl lg:text-8xl font-black text-danger-500 stat-number">
      {count}
      <span className="text-3xl sm:text-4xl lg:text-5xl ml-1">명</span>
    </span>
  );
}

/* ─── Ticker Item Data ─────────────────────────────── */
const TICKER_ITEMS = [
  "📞 서울 마포구 — 검찰 사칭 전화 감지",
  "💬 경기 성남시 — 택배 사칭 문자 차단",
  "📱 부산 해운대구 — 가족 사칭 메신저 신고",
  "📞 대구 중구 — 은행 사칭 전화 차단",
  "💬 인천 남동구 — 경품 사칭 문자 감지",
  "📱 광주 서구 — 투자 사기 단톡방 신고",
  "📞 대전 유성구 — 경찰 사칭 전화 감지",
  "💬 울산 남구 — 건강보험 사칭 문자 차단",
];

/* ─── Difficulty Dots ────────────────────────────────── */
function DifficultyDots({ level }: { level: Difficulty }) {
  return (
    <div className="difficulty-dots" aria-label={`난이도: ${DIFFICULTY_LABELS[level]}`}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`difficulty-dot ${i <= level ? "active" : ""}`}
        />
      ))}
    </div>
  );
}

/* ─── Bar Chart Component ────────────────────────────── */
function YearlyBarChart() {
  const { ref, visible } = useReveal();
  const maxCases = Math.max(...YEARLY_STATS.map((s) => s.cases));
  const maxLoss = Math.max(...YEARLY_STATS.map((s) => s.totalLoss));

  return (
    <div ref={ref} className="w-full">
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-primary-500" />
          <span className="text-gray-600">발생 건수</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-danger-400" />
          <span className="text-gray-600">피해액 (억원)</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-2 sm:gap-4 h-52 sm:h-64 px-2">
        {YEARLY_STATS.map((stat, idx) => {
          const casesHeight = (stat.cases / maxCases) * 100;
          const lossHeight = (stat.totalLoss / maxLoss) * 100;
          const delay = idx * 100;

          return (
            <div key={stat.year} className="flex-1 flex flex-col items-center gap-1">
              {/* Bars */}
              <div className="flex items-end gap-0.5 sm:gap-1 w-full justify-center h-44 sm:h-56">
                {/* Cases bar */}
                <div
                  className="w-3 sm:w-5 rounded-t-sm bg-primary-500 bar-chart-bar relative group"
                  style={{
                    height: visible ? `${casesHeight}%` : "0%",
                    transitionDelay: `${delay}ms`,
                    opacity: visible ? 1 : 0,
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {stat.cases.toLocaleString()}건
                  </div>
                </div>
                {/* Loss bar */}
                <div
                  className="w-3 sm:w-5 rounded-t-sm bg-danger-400 bar-chart-bar relative group"
                  style={{
                    height: visible ? `${lossHeight}%` : "0%",
                    transitionDelay: `${delay + 50}ms`,
                    opacity: visible ? 1 : 0,
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {stat.totalLoss.toLocaleString()}억
                  </div>
                </div>
              </div>
              {/* Year label */}
              <span className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                {stat.year}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Phone Mockup Illustration ──────────────────────── */
function PhoneMockup() {
  const [msgIdx, setMsgIdx] = useState(0);
  const messages = [
    { sender: "system", text: "📞 02-3480-2000에서 전화가 왔습니다" },
    { sender: "scammer", text: "서울중앙지검 김현수 검사입니다." },
    { sender: "scammer", text: "귀하 명의 계좌가 범죄에 연루되었습니다." },
    { sender: "safe", text: "🛡️ 검찰은 전화로 수사하지 않습니다!" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="phone-mockup animate-float">
      <div className="phone-screen">
        {/* Status bar */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 px-2 mb-4">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Call indicator */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">📞</div>
          <div className="text-sm text-gray-300 font-medium">수신 전화</div>
          <div className="text-xs text-gray-500 mt-1">02-3480-2000</div>
          <div className="text-[10px] text-danger-400 mt-1 animate-alert-flash">
            ⚠️ 사칭 의심
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`text-xs px-3 py-2 rounded-xl transition-all duration-500 ${
                i <= msgIdx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              } ${
                msg.sender === "system"
                  ? "bg-gray-800 text-gray-300 text-center text-[10px]"
                  : msg.sender === "safe"
                  ? "bg-success-600/20 text-success-400 border border-success-600/30"
                  : "bg-danger-600/20 text-danger-300 border border-danger-600/30"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Bottom buttons */}
        <div className="flex gap-4 justify-center mt-4">
          <div className="w-12 h-12 rounded-full bg-danger-600 flex items-center justify-center text-xl">
            📵
          </div>
          <div className="w-12 h-12 rounded-full bg-success-600 flex items-center justify-center text-xl animate-pulse-gentle">
            🛡️
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Landing Page Component
   ═══════════════════════════════════════════════════════ */
export default function LandingPage() {
  /* ── CountUp refs ─── */
  const lossCounter = useCountUp(10200, 2000, "억", "");
  const victimCounter = useCountUp(71, 2000, "명");
  const recoveryCounter = useCountUp(7, 1500, "%");
  const unreportedCounter = useCountUp(60, 1500, "%");

  /* ── Reveal refs ─── */
  const statsReveal = useReveal();
  const trendReveal = useReveal();
  const scenarioReveal = useReveal();
  const howReveal = useReveal();
  const quizReveal = useReveal();
  const emergencyReveal = useReveal();

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════════════
          Section 1: Hero
          ═══════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-danger-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-danger-50 border border-danger-200 text-danger-700 text-sm font-medium mb-6">
                <span className="animate-alert-flash">🔴</span>
                실시간 피싱 위협 감지 중
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">
                지금 이 순간에도,
                <br />
                <span className="gradient-text-danger">누군가 속고</span> 있습니다
              </h1>

              <div className="my-8">
                <p className="text-sm text-gray-500 mb-2">
                  오늘 하루에만 보이스피싱 피해자
                </p>
                <DailyVictimsCounter />
                <p className="text-sm text-gray-500 mt-3">
                  연간 피해액{" "}
                  <span className="font-bold text-gray-700">
                    {KEY_STATS.yearlyLoss}원
                  </span>{" "}
                  | 전년 대비{" "}
                  <span className="font-bold text-danger-600">
                    {KEY_STATS.yearlyIncrease}
                  </span>{" "}
                  증가
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/simulation"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white gradient-card shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow duration-300"
                >
                  🎯 피싱 체험하기
                </Link>
                <Link
                  href="/quiz"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-primary-700 bg-primary-50 border-2 border-primary-200 hover:bg-primary-100 transition-colors duration-200"
                >
                  📝 피싱 퀴즈
                </Link>
              </div>
            </div>

            {/* Right: Phone Mockup */}
            <div className="hidden lg:flex justify-center">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          Section 2: Live Ticker
          ═══════════════════════════════════════════════════ */}
      <section className="py-3 bg-navy-900 text-white overflow-hidden">
        <div className="ticker-wrap">
          <div className="ticker-content">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center mx-8 text-sm font-medium whitespace-nowrap"
              >
                <span className="text-danger-400 mr-2">LIVE</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          Section 3: Problem Stats
          ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white">
        <div
          ref={statsReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
            statsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              보이스피싱, 얼마나 심각할까요?
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              2025년 기준 보이스피싱 피해 현황입니다. 숫자 하나하나가 실제 피해자의 이야기입니다.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Yearly Loss */}
            <div className="card-hover bg-gradient-to-br from-danger-50 to-white rounded-2xl p-6 border border-danger-100 text-center">
              <div className="text-3xl mb-3">💰</div>
              <div className="text-2xl sm:text-3xl font-black text-danger-600 stat-number">
                <span ref={lossCounter.ref}>{lossCounter.display}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">연간 피해액 (원)</div>
              <div className="text-[11px] text-danger-500 font-medium mt-2">
                {KEY_STATS.yearlyIncrease} 전년 대비
              </div>
            </div>

            {/* Daily Victims */}
            <div className="card-hover bg-gradient-to-br from-primary-50 to-white rounded-2xl p-6 border border-primary-100 text-center">
              <div className="text-3xl mb-3">👤</div>
              <div className="text-2xl sm:text-3xl font-black text-primary-700 stat-number">
                <span ref={victimCounter.ref}>{victimCounter.display}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">하루 평균 피해자</div>
              <div className="text-[11px] text-primary-600 font-medium mt-2">
                매 20분마다 1명
              </div>
            </div>

            {/* Recovery Rate */}
            <div className="card-hover bg-gradient-to-br from-warning-50 to-white rounded-2xl p-6 border border-warning-100 text-center">
              <div className="text-3xl mb-3">📉</div>
              <div className="text-2xl sm:text-3xl font-black text-warning-600 stat-number">
                <span ref={recoveryCounter.ref}>{recoveryCounter.display}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">피해금 회수율</div>
              <div className="text-[11px] text-warning-600 font-medium mt-2">
                93%는 되찾지 못함
              </div>
            </div>

            {/* Unreported Rate */}
            <div className="card-hover bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 text-center">
              <div className="text-3xl mb-3">🤫</div>
              <div className="text-2xl sm:text-3xl font-black text-gray-700 stat-number">
                <span ref={unreportedCounter.ref}>
                  {unreportedCounter.display}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">미신고 추정 비율</div>
              <div className="text-[11px] text-gray-500 font-medium mt-2">
                실제 피해는 더 큼
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          Section 4: Yearly Trend
          ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div
          ref={trendReveal.ref}
          className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
            trendReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              연도별 피해 추이
            </h2>
            <p className="text-gray-500">
              2025년 피해액은 역대 최고치인{" "}
              <span className="font-bold text-danger-600">1조 200억원</span>을
              기록했습니다
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <YearlyBarChart />
          </div>

          {/* Scam type breakdown */}
          <div className="mt-8 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
              유형별 피해 비율
            </h3>
            <div className="space-y-3">
              {SCAM_TYPE_STATS.map((stat) => (
                <div key={stat.type} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-36 sm:w-44 shrink-0 truncate">
                    {stat.type}
                  </span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                      style={{
                        width: trendReveal.visible ? `${stat.percentage}%` : "0%",
                        backgroundColor: stat.color,
                        minWidth: trendReveal.visible ? "2rem" : "0",
                      }}
                    >
                      <span className="text-[11px] font-bold text-white">
                        {stat.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          Section 5: Scenario Preview
          ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white">
        <div
          ref={scenarioReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
            scenarioReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              5가지 실전 시나리오
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              실제 피해 사례를 바탕으로 한 시뮬레이션. 안전한 환경에서 대응 능력을 키워보세요.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCENARIOS.map((scenario, idx) => (
              <Link
                key={scenario.id}
                href={`/simulation?id=${scenario.id}`}
                className={`card-hover group relative rounded-2xl border overflow-hidden transition-all duration-500 ${
                  scenarioReveal.visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{
                  borderColor: `${scenario.color}30`,
                  transitionDelay: scenarioReveal.visible
                    ? `${idx * 100}ms`
                    : "0ms",
                }}
              >
                {/* Top accent */}
                <div
                  className="h-1"
                  style={{ backgroundColor: scenario.color }}
                />

                <div className="p-6">
                  {/* Icon & badges */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{scenario.icon}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[11px] font-semibold px-2 py-1 rounded-full"
                        style={{
                          color: scenario.color,
                          backgroundColor: scenario.bgColor,
                        }}
                      >
                        {SCENARIO_TYPE_LABELS[scenario.type]}
                      </span>
                      <DifficultyDots level={scenario.difficulty} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">
                    {scenario.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {scenario.subtitle}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                    <span>{scenario.avgLoss}</span>
                    <span className="group-hover:text-primary-600 transition-colors font-medium">
                      체험하기 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          Section 6: How It Works
          ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-navy-900 text-white">
        <div
          ref={howReveal.ref}
          className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
            howReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              어떻게 진행되나요?
            </h2>
            <p className="text-primary-200">
              3단계로 보이스피싱 대응 능력을 키울 수 있습니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: "01",
                icon: "📋",
                title: "시나리오 선택",
                desc: "검찰 사칭, 택배 문자, 가족 사칭 등 5가지 실전 시나리오 중 선택하세요",
              },
              {
                step: "02",
                icon: "📱",
                title: "실제 상황 체험",
                desc: "실제 보이스피싱과 동일한 대화를 체험하며, 각 단계에서 선택지를 고르세요",
              },
              {
                step: "03",
                icon: "🎓",
                title: "대응법 학습",
                desc: "선택별 피드백과 위험 신호를 확인하고, 올바른 대응법을 학습하세요",
              },
            ].map((item, idx) => (
              <div
                key={item.step}
                className={`relative text-center p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-500 ${
                  howReveal.visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{
                  transitionDelay: howReveal.visible ? `${idx * 150}ms` : "0ms",
                }}
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold">
                  {item.step}
                </div>

                <div className="text-4xl mt-2 mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-primary-200 leading-relaxed">
                  {item.desc}
                </p>

                {/* Arrow between steps (desktop) */}
                {idx < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-primary-400 text-xl z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          Section 7: Quiz CTA
          ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white">
        <div
          ref={quizReveal.ref}
          className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
            quizReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative overflow-hidden rounded-3xl gradient-card p-8 sm:p-12 text-center text-white">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
              <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-white/5 rounded-full" />
            </div>

            <div className="relative">
              <div className="text-5xl mb-4">📝</div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                10문제로 확인하는
                <br />
                나의 피싱 판별력
              </h2>
              <p className="text-primary-100 mb-8 max-w-lg mx-auto">
                실제 문자, 전화, 메시지 중 피싱을 가려낼 수 있나요?
                <br />
                퀴즈로 나의 보안 감각을 테스트해보세요.
              </p>
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-primary-700 bg-white hover:bg-primary-50 transition-colors shadow-xl"
              >
                🧩 퀴즈 시작하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          Section 8: Emergency Numbers
          ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div
          ref={emergencyReveal.ref}
          className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
            emergencyReveal.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              피싱이 의심되면, 즉시 신고하세요
            </h2>
            <p className="text-gray-500">
              아래 번호로 전화하면 24시간 상담 및 신고가 가능합니다
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                number: "112",
                label: "경찰청",
                desc: "피싱 사기 신고",
                color: "bg-danger-600",
                hoverColor: "hover:bg-danger-700",
              },
              {
                number: "1332",
                label: "금융감독원",
                desc: "금융 사기 상담",
                color: "bg-primary-600",
                hoverColor: "hover:bg-primary-700",
              },
              {
                number: "118",
                label: "인터넷진흥원",
                desc: "스미싱/악성앱 신고",
                color: "bg-success-600",
                hoverColor: "hover:bg-success-700",
              },
            ].map((item) => (
              <a
                key={item.number}
                href={`tel:${item.number}`}
                className={`emergency-btn flex-col gap-2 ${item.color} ${item.hoverColor} text-white rounded-2xl p-6 sm:p-8 text-center shadow-lg transition-all duration-200 hover:scale-[1.02]`}
              >
                <span className="text-4xl sm:text-5xl font-black">
                  {item.number}
                </span>
                <span className="text-lg font-bold">{item.label}</span>
                <span className="text-sm opacity-80">{item.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          Section 9: Footer
          ═══════════════════════════════════════════════════ */}
      <footer className="bg-navy-900 text-gray-400 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🛡️</span>
                <span className="text-xl font-extrabold text-white">
                  피싱제로
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                보이스피싱 피해를 예방하기 위한 체험형 교육 시뮬레이터입니다.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-white font-semibold mb-4">체험하기</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/simulation" className="hover:text-white transition-colors">
                    피싱 시뮬레이션
                  </Link>
                </li>
                <li>
                  <Link href="/quiz" className="hover:text-white transition-colors">
                    피싱 퀴즈
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">정보</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/cases" className="hover:text-white transition-colors">
                    실제 사례
                  </Link>
                </li>
                <li>
                  <Link href="/guide" className="hover:text-white transition-colors">
                    예방 가이드
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">긴급 신고</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="tel:112" className="hover:text-white transition-colors">
                    112 경찰청
                  </a>
                </li>
                <li>
                  <a href="tel:1332" className="hover:text-white transition-colors">
                    1332 금융감독원
                  </a>
                </li>
                <li>
                  <a href="tel:118" className="hover:text-white transition-colors">
                    118 인터넷진흥원
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <p>
                &copy; {new Date().getFullYear()} 피싱제로. 교육 목적으로
                제작되었습니다.
              </p>
              <p className="text-center sm:text-right text-gray-500">
                본 시뮬레이터는 교육 및 예방 목적이며, 실제 피싱 행위와 무관합니다.
                <br />
                통계 데이터 출처: 경찰청, 금융감독원 (2025)
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
