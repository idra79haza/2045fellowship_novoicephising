"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SCENARIOS } from "@/lib/scenarios";
import {
  PhishingScenario,
  Safety,
  SCENARIO_TYPE_LABELS,
  SCENARIO_TYPE_ICONS,
  DIFFICULTY_LABELS,
  SAFETY_CONFIG,
} from "@/lib/types";
import { completeScenario } from "@/lib/store";

// ─── Types ──────────────────────────────────────────────

interface SimulationResult {
  scenario: PhishingScenario;
  exitPhase: number;
  exitSafety: Safety;
  foundRedFlags: string[];
  missedRedFlags: string[];
  score: number;
  title: string;
  emoji: string;
}

// ─── Constants ──────────────────────────────────────────

const SCORE_MAP: { score: number; title: string; emoji: string }[] = [
  { score: 100, title: "완벽한 대응!", emoji: "\uD83D\uDEE1\uFE0F" },
  { score: 70, title: "좋은 판단!", emoji: "\uD83D\uDC4D" },
  { score: 40, title: "아슬아슬했지만 막았습니다", emoji: "\uD83D\uDE13" },
  { score: 0, title: "피해 발생!", emoji: "\uD83D\uDEA8" },
];

function getScoreForExit(
  phaseIndex: number,
  totalPhases: number,
  safety: Safety
): { score: number; title: string; emoji: string } {
  if (safety === "danger") {
    return SCORE_MAP[3];
  }
  if (safety === "safe") {
    if (phaseIndex === 0) return SCORE_MAP[0];
    if (phaseIndex === 1) return SCORE_MAP[1];
    return SCORE_MAP[2];
  }
  // caution exits
  if (phaseIndex <= 1) return SCORE_MAP[1];
  return SCORE_MAP[2];
}

// ─── Phone Mockup Components ─────────────────────────────

function PhoneStatusBar({ type, scenario }: { type: string; scenario: PhishingScenario }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })
      );
    }
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-xs font-semibold text-white">
      <span>{time}</span>
      <div className="flex items-center gap-1">
        {/* Signal bars */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <rect x="0" y="9" width="3" height="3" rx="0.5" fill="white" />
          <rect x="4" y="6" width="3" height="6" rx="0.5" fill="white" />
          <rect x="8" y="3" width="3" height="9" rx="0.5" fill="white" />
          <rect x="12" y="0" width="3" height="12" rx="0.5" fill="white" opacity="0.4" />
        </svg>
        {/* Battery */}
        <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
          <rect x="0.5" y="0.5" width="18" height="11" rx="2" stroke="white" strokeWidth="1" />
          <rect x="2" y="2" width="12" height="8" rx="1" fill="white" />
          <rect x="19.5" y="3.5" width="2" height="5" rx="1" fill="white" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

function TypingIndicator({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-0.5 px-4 py-3 rounded-2xl rounded-bl-sm bg-gray-100 w-fit max-w-[80px]">
      <span
        className="block w-2 h-2 rounded-full animate-bounce"
        style={{ backgroundColor: color || "#9CA3AF", animationDelay: "0ms" }}
      />
      <span
        className="block w-2 h-2 rounded-full animate-bounce"
        style={{ backgroundColor: color || "#9CA3AF", animationDelay: "200ms" }}
      />
      <span
        className="block w-2 h-2 rounded-full animate-bounce"
        style={{ backgroundColor: color || "#9CA3AF", animationDelay: "400ms" }}
      />
    </div>
  );
}

function CallDurationTimer({ isActive }: { isActive: boolean }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  return <span className="text-white/80 text-sm font-mono">{mins}:{secs}</span>;
}

// ─── Scenario Card (Selection) ───────────────────────────

function ScenarioCard({
  scenario,
  onSelect,
}: {
  scenario: PhishingScenario;
  onSelect: (s: PhishingScenario) => void;
}) {
  return (
    <button
      onClick={() => onSelect(scenario)}
      className="group relative w-full text-left rounded-2xl border-2 border-transparent p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
      style={{ backgroundColor: scenario.bgColor }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = scenario.color;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="text-4xl w-16 h-16 flex items-center justify-center rounded-xl shrink-0"
          style={{ backgroundColor: `${scenario.color}20` }}
        >
          {scenario.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-lg font-bold text-gray-900">{scenario.title}</h3>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: scenario.color }}
            >
              {SCENARIO_TYPE_ICONS[scenario.type]} {SCENARIO_TYPE_LABELS[scenario.type]}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{scenario.subtitle}</p>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span>
              {"★".repeat(scenario.difficulty)}
              {"☆".repeat(3 - scenario.difficulty)}{" "}
              {DIFFICULTY_LABELS[scenario.difficulty]}
            </span>
            <span>{scenario.avgLoss}</span>
            <span>{scenario.victimProfile}</span>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${scenario.color}08 0%, ${scenario.color}15 100%)`,
        }}
      />
    </button>
  );
}

// ─── Main Simulation Content ─────────────────────────────

function SimulationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State management
  const [selectedScenario, setSelectedScenario] = useState<PhishingScenario | null>(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [messagesShown, setMessagesShown] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [foundRedFlags, setFoundRedFlags] = useState<string[]>([]);
  const [totalRedFlags, setTotalRedFlags] = useState(0);
  const [newRedFlag, setNewRedFlag] = useState<string | null>(null);
  const [animatingRedFlag, setAnimatingRedFlag] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // TTS (Text-to-Speech) state
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lastSpokenRef = useRef<string>("");

  // TTS: speak a message
  const speak = useCallback((text: string) => {
    if (!ttsEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 0.95;
    utterance.pitch = 0.9;
    // Try to find a Korean voice
    const voices = window.speechSynthesis.getVoices();
    const koVoice = voices.find((v) => v.lang.startsWith("ko"));
    if (koVoice) utterance.voice = koVoice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [ttsEnabled]);

  // TTS: read new scammer messages aloud
  useEffect(() => {
    if (!selectedScenario || !ttsEnabled || result) return;
    const phase = selectedScenario.phases[currentPhase];
    if (!phase || messagesShown === 0) return;
    const lastMsg = phase.messages[messagesShown - 1];
    if (lastMsg && lastMsg.sender === "scammer") {
      const key = `${currentPhase}-${messagesShown - 1}`;
      if (lastSpokenRef.current !== key) {
        lastSpokenRef.current = key;
        speak(lastMsg.text);
      }
    }
  }, [selectedScenario, currentPhase, messagesShown, ttsEnabled, result, speak]);

  // TTS: cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-select scenario from URL param
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const found = SCENARIOS.find((s) => s.id === id);
      if (found) {
        setSelectedScenario(found);
        setTotalRedFlags(found.allRedFlags.length);
      }
    }
  }, [searchParams]);

  // Count total red flags when scenario selected
  useEffect(() => {
    if (selectedScenario) {
      setTotalRedFlags(selectedScenario.allRedFlags.length);
    }
  }, [selectedScenario]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesShown, isTyping]);

  // Message animation
  useEffect(() => {
    if (!selectedScenario || result) return;
    const phase = selectedScenario.phases[currentPhase];
    if (!phase) return;

    if (messagesShown < phase.messages.length) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setMessagesShown((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (messagesShown === phase.messages.length && !showChoices) {
      const timer = setTimeout(() => setShowChoices(true), 500);
      return () => clearTimeout(timer);
    }
  }, [selectedScenario, currentPhase, messagesShown, showChoices, result]);

  // Handle scenario selection
  const handleSelectScenario = useCallback((scenario: PhishingScenario) => {
    setSelectedScenario(scenario);
    setCurrentPhase(0);
    setMessagesShown(0);
    setShowChoices(false);
    setSelectedChoice(null);
    setShowFeedback(false);
    setResult(null);
    setFoundRedFlags([]);
    setTotalRedFlags(scenario.allRedFlags.length);
    setNewRedFlag(null);
    setAnimatingRedFlag(false);
  }, []);

  // Handle choice selection
  const handleChoice = useCallback(
    (choiceIndex: number) => {
      if (!selectedScenario || selectedChoice !== null) return;
      const phase = selectedScenario.phases[currentPhase];

      setSelectedChoice(choiceIndex);
      setShowFeedback(true);

      // Reveal red flags for this phase
      const newFlags = phase.revealedRedFlags.filter((f) => !foundRedFlags.includes(f));
      if (newFlags.length > 0) {
        const updatedFlags = [...foundRedFlags, ...newFlags];
        setFoundRedFlags(updatedFlags);

        // Animate new red flags one by one
        let delay = 300;
        newFlags.forEach((flag) => {
          setTimeout(() => {
            setNewRedFlag(flag);
            setAnimatingRedFlag(true);
            setTimeout(() => setAnimatingRedFlag(false), 1000);
          }, delay);
          delay += 600;
        });
      }
    },
    [selectedScenario, selectedChoice, currentPhase, foundRedFlags]
  );

  // Continue to next phase or show results
  const handleContinue = useCallback(() => {
    if (!selectedScenario || selectedChoice === null) return;
    const phase = selectedScenario.phases[currentPhase];
    const choice = phase.choices[selectedChoice];

    if (choice.isExit || currentPhase >= selectedScenario.phases.length - 1) {
      // End simulation
      const scoreData = getScoreForExit(
        currentPhase,
        selectedScenario.phases.length,
        choice.safety
      );
      const allRevealed = selectedScenario.phases
        .slice(0, currentPhase + 1)
        .flatMap((p) => p.revealedRedFlags);
      const uniqueFound = Array.from(new Set(allRevealed));
      const missed = selectedScenario.allRedFlags.filter((f) => !uniqueFound.includes(f));

      const simResult: SimulationResult = {
        scenario: selectedScenario,
        exitPhase: currentPhase,
        exitSafety: choice.safety,
        foundRedFlags: uniqueFound,
        missedRedFlags: missed,
        score: scoreData.score,
        title: scoreData.title,
        emoji: scoreData.emoji,
      };

      setResult(simResult);
      completeScenario(selectedScenario.id, uniqueFound.length, missed.length);
    } else {
      // Move to next phase
      setCurrentPhase((prev) => prev + 1);
      setMessagesShown(0);
      setShowChoices(false);
      setSelectedChoice(null);
      setShowFeedback(false);
    }
  }, [selectedScenario, selectedChoice, currentPhase]);

  // Reset everything
  const handleReset = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    lastSpokenRef.current = "";
    setSelectedScenario(null);
    setCurrentPhase(0);
    setMessagesShown(0);
    setShowChoices(false);
    setSelectedChoice(null);
    setShowFeedback(false);
    setResult(null);
    setFoundRedFlags([]);
    setTotalRedFlags(0);
    setNewRedFlag(null);
    setAnimatingRedFlag(false);
  }, []);

  // ─── Render: Scenario Selection ─────────────────────

  if (!selectedScenario) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              피싱 시뮬레이션 체험
            </h1>
            <p className="text-gray-500">
              실제 피싱 수법을 안전하게 체험하고, 대응 방법을 배워보세요.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {SCENARIOS.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onSelect={handleSelectScenario}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Render: Results ────────────────────────────────

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Score Card */}
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              backgroundColor:
                result.exitSafety === "danger"
                  ? SAFETY_CONFIG.danger.bgColor
                  : result.score === 100
                    ? SAFETY_CONFIG.safe.bgColor
                    : SAFETY_CONFIG.caution.bgColor,
            }}
          >
            <div className="text-6xl mb-4">{result.emoji}</div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{
                color:
                  result.exitSafety === "danger"
                    ? SAFETY_CONFIG.danger.color
                    : result.score === 100
                      ? SAFETY_CONFIG.safe.color
                      : SAFETY_CONFIG.caution.color,
              }}
            >
              {result.title}
            </h2>
            <div className="text-5xl font-black mb-2" style={{ color: result.scenario.color }}>
              {result.score}
              <span className="text-lg font-normal text-gray-400">/100</span>
            </div>
            {result.exitSafety === "danger" && (
              <p className="text-red-600 font-semibold mt-2">
                예상 피해: <span className="underline">{result.scenario.avgLoss}</span>
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {result.exitPhase + 1}단계에서{" "}
              {result.exitSafety === "danger" ? "피해가 발생했습니다" : "성공적으로 대응했습니다"}
            </p>
          </div>

          {/* Red Flags Analysis */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-red-500">&#x1F6A9;</span> 위험 신호 분석
              <span className="text-sm font-normal text-gray-400">
                ({result.foundRedFlags.length}/{result.scenario.allRedFlags.length} 감지)
              </span>
            </h3>
            <div className="space-y-2">
              {result.scenario.allRedFlags.map((flag, i) => {
                const found = result.foundRedFlags.includes(flag);
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{
                      backgroundColor: found ? "#ECFDF5" : "#FEF2F2",
                    }}
                  >
                    <span className="text-lg shrink-0">{found ? "\u2705" : "\u274C"}</span>
                    <div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: found ? "#059669" : "#DC2626" }}
                      >
                        {flag}
                      </span>
                      {!found && (
                        <span className="block text-xs text-red-400 mt-0.5">놓친 위험 신호</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prevention Tips */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>&#x1F4A1;</span> 예방 수칙
            </h3>
            <ul className="space-y-2">
              {result.scenario.preventionTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                    style={{ backgroundColor: result.scenario.color }}
                  >
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Real Case */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4" style={{ borderColor: "#EF4444" }}>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>&#x1F4F0;</span> 실제 사례
            </h3>
            <h4 className="font-semibold text-gray-800 mb-2">{result.scenario.realCase.title}</h4>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              {result.scenario.realCase.description}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-600 font-bold text-lg">
                피해액: {result.scenario.realCase.loss}
              </span>
              <span className="text-gray-400">
                {result.scenario.realCase.source} ({result.scenario.realCase.year})
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: result.scenario.color }}
            >
              다른 시나리오 체험하기
            </button>
            <button
              onClick={() => router.push("/quiz")}
              className="flex-1 py-3 px-6 rounded-xl font-semibold border-2 transition-all hover:bg-gray-50 cursor-pointer"
              style={{ borderColor: result.scenario.color, color: result.scenario.color }}
            >
              퀴즈 도전하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render: Simulation ─────────────────────────────

  const phase = selectedScenario.phases[currentPhase];
  const isCall = selectedScenario.type === "call";
  const isKakao = selectedScenario.type === "kakaotalk";

  return (
    <div className="min-h-screen bg-gray-900 py-6 px-4 flex flex-col items-center">
      {/* Red Flag Counter + TTS Toggle */}
      <div className="w-full max-w-sm mb-4 flex items-center gap-2">
        <div
          className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-between transition-all"
          style={{ backgroundColor: selectedScenario.color }}
        >
          <span className="flex items-center gap-2">
            <span>&#x1F6A9;</span>
            <span>
              {foundRedFlags.length}/{totalRedFlags} 위험 신호 감지
            </span>
          </span>
          {animatingRedFlag && newRedFlag && (
            <span
              className="text-xs bg-white/20 px-2 py-1 rounded-full"
              style={{ animation: "flagPulse 1s ease-out" }}
            >
              +1 발견!
            </span>
          )}
        </div>
        <button
          onClick={() => {
            const next = !ttsEnabled;
            setTtsEnabled(next);
            if (!next && typeof window !== "undefined" && window.speechSynthesis) {
              window.speechSynthesis.cancel();
              setIsSpeaking(false);
            }
          }}
          className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer"
          style={{
            backgroundColor: ttsEnabled ? selectedScenario.color : "#374151",
            border: ttsEnabled ? "none" : "1px solid #4B5563",
          }}
          title={ttsEnabled ? "음성 끄기" : "음성 켜기"}
        >
          {ttsEnabled ? (
            isSpeaking ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="white" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="white" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-sm mb-4 flex items-center gap-2">
        {selectedScenario.phases.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full transition-all duration-500"
            style={{
              backgroundColor:
                i < currentPhase
                  ? selectedScenario.color
                  : i === currentPhase
                    ? selectedScenario.color
                    : "#374151",
              opacity: i <= currentPhase ? 1 : 0.3,
            }}
          />
        ))}
        <span className="text-xs text-gray-400 shrink-0 ml-1">
          {currentPhase + 1}/{selectedScenario.phases.length}
        </span>
      </div>

      {/* Phone Mockup */}
      <div className="w-full max-w-sm">
        <div
          className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-gray-700"
          style={{
            background: isCall
              ? `linear-gradient(180deg, ${selectedScenario.color} 0%, ${selectedScenario.color}CC 100%)`
              : isKakao
                ? "#B2C7D9"
                : "#F9FAFB",
          }}
        >
          {/* Notch Area */}
          <div
            className="relative pt-2 pb-0"
            style={{
              backgroundColor: isCall
                ? "rgba(0,0,0,0.2)"
                : isKakao
                  ? "#92AAC0"
                  : "#E5E7EB",
            }}
          >
            <div className="mx-auto w-28 h-6 bg-black rounded-b-2xl" />
            <PhoneStatusBar type={selectedScenario.type} scenario={selectedScenario} />
          </div>

          {/* Call UI */}
          {isCall && (
            <div className="px-6 pt-6 pb-4 text-center">
              <div className="w-20 h-20 rounded-full bg-white/20 mx-auto mb-3 flex items-center justify-center text-3xl">
                {selectedScenario.icon}
              </div>
              <p className="text-white font-semibold text-lg">{selectedScenario.callerInfo}</p>
              <CallDurationTimer isActive={true} />
            </div>
          )}

          {/* Chat Header for SMS/KakaoTalk */}
          {!isCall && (
            <div
              className="px-4 py-3 flex items-center gap-3"
              style={{
                backgroundColor: isKakao ? "#92AAC0" : "#E5E7EB",
              }}
            >
              <button
                onClick={handleReset}
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: `${selectedScenario.color}30` }}
                >
                  {selectedScenario.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{selectedScenario.callerInfo}</p>
                </div>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div
            className="px-4 py-4 space-y-3 overflow-y-auto"
            style={{
              minHeight: isCall ? "200px" : "320px",
              maxHeight: isCall ? "300px" : "400px",
              backgroundColor: isCall
                ? "transparent"
                : isKakao
                  ? "#B2C7D9"
                  : "#F9FAFB",
            }}
          >
            {phase.messages.slice(0, messagesShown).map((msg, i) => {
              if (msg.sender === "system") {
                return (
                  <div
                    key={`${currentPhase}-${i}`}
                    className="text-center"
                    style={{ animation: "slideIn 0.3s ease-out" }}
                  >
                    <span
                      className="inline-block text-xs px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: isCall ? "rgba(255,255,255,0.2)" : "#E5E7EB",
                        color: isCall ? "white" : "#6B7280",
                      }}
                    >
                      {msg.text}
                    </span>
                  </div>
                );
              }

              // Scammer message
              return (
                <div
                  key={`${currentPhase}-${i}`}
                  className="flex items-end gap-2"
                  style={{ animation: "slideInLeft 0.4s ease-out" }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0"
                    style={{
                      backgroundColor: isCall
                        ? "rgba(255,255,255,0.2)"
                        : isKakao
                          ? "#FEE500"
                          : "#E5E7EB",
                    }}
                  >
                    {selectedScenario.icon}
                  </div>
                  <div
                    className="max-w-[75%] px-3 py-2.5 text-sm rounded-2xl rounded-bl-sm leading-relaxed"
                    style={{
                      backgroundColor: isCall
                        ? "rgba(255,255,255,0.15)"
                        : isKakao
                          ? "white"
                          : "#E5E7EB",
                      color: isCall ? "white" : "#1F2937",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0"
                  style={{
                    backgroundColor: isCall
                      ? "rgba(255,255,255,0.2)"
                      : isKakao
                        ? "#FEE500"
                        : "#E5E7EB",
                  }}
                >
                  {selectedScenario.icon}
                </div>
                <TypingIndicator color={selectedScenario.color} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Home Indicator */}
          <div
            className="flex justify-center pb-3 pt-1"
            style={{
              backgroundColor: isCall
                ? "transparent"
                : isKakao
                  ? "#B2C7D9"
                  : "#F9FAFB",
            }}
          >
            <div className="w-32 h-1 rounded-full bg-gray-400/50" />
          </div>
        </div>
      </div>

      {/* Choice Interface (below phone) */}
      {showChoices && (
        <div className="w-full max-w-sm mt-6 space-y-3" style={{ animation: "fadeInUp 0.4s ease-out" }}>
          {selectedChoice === null ? (
            <>
              <p className="text-center text-gray-400 text-sm mb-2">어떻게 대응하시겠습니까?</p>
              {phase.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(i)}
                  className="w-full text-left p-4 rounded-xl border-2 border-gray-700 bg-gray-800 text-white hover:border-gray-500 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span className="text-lg mr-2">{choice.emoji}</span>
                  <span className="text-sm">{choice.text}</span>
                </button>
              ))}
            </>
          ) : (
            <>
              {/* Show all choices with results */}
              {phase.choices.map((choice, i) => {
                const isSelected = i === selectedChoice;
                const config = SAFETY_CONFIG[choice.safety];
                return (
                  <div
                    key={i}
                    className="w-full text-left p-4 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: isSelected ? config.color : "#374151",
                      backgroundColor: isSelected ? config.bgColor : "#1F2937",
                      opacity: isSelected ? 1 : 0.5,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{choice.emoji}</span>
                      <span className="text-sm" style={{ color: isSelected ? "#1F2937" : "#9CA3AF" }}>
                        {choice.text}
                      </span>
                      {isSelected && (
                        <span
                          className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: config.color }}
                        >
                          {config.label}
                        </span>
                      )}
                    </div>
                    {isSelected && showFeedback && (
                      <p className="text-sm mt-2 pl-7" style={{ color: config.color }}>
                        {choice.feedback}
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Revealed Red Flags */}
              {showFeedback && phase.revealedRedFlags.length > 0 && (
                <div
                  className="bg-red-900/30 border border-red-800/50 rounded-xl p-4 mt-2"
                  style={{ animation: "fadeInUp 0.5s ease-out" }}
                >
                  <p className="text-red-400 text-xs font-semibold mb-2 flex items-center gap-1">
                    <span>&#x1F6A9;</span> 이 단계에서 발견된 위험 신호
                  </p>
                  {phase.revealedRedFlags.map((flag, i) => (
                    <p key={i} className="text-red-300 text-sm flex items-start gap-2 mb-1">
                      <span className="shrink-0">&#x2022;</span>
                      {flag}
                    </p>
                  ))}
                </div>
              )}

              {/* Continue Button */}
              {showFeedback && (
                <button
                  onClick={handleContinue}
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 cursor-pointer"
                  style={{
                    backgroundColor: selectedScenario.color,
                    animation: "fadeInUp 0.3s ease-out",
                  }}
                >
                  {phase.choices[selectedChoice].isExit ||
                  currentPhase >= selectedScenario.phases.length - 1
                    ? "결과 확인하기"
                    : "다음 단계로"}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Back button for call type */}
      {isCall && (
        <button
          onClick={handleReset}
          className="mt-6 text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
        >
          시나리오 목록으로 돌아가기
        </button>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes flagPulse {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

// ─── Page (with Suspense boundary) ───────────────────────

export default function SimulationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      }
    >
      <SimulationContent />
    </Suspense>
  );
}
