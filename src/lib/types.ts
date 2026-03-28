// ─── Scenario Types ──────────────────────────────────

export type ScenarioType = "call" | "sms" | "kakaotalk";
export type Difficulty = 1 | 2 | 3;
export type Safety = "safe" | "caution" | "danger";

export interface ScenarioMessage {
  sender: "scammer" | "system";
  text: string;
}

export interface ScenarioChoice {
  text: string;
  emoji: string;
  safety: Safety;
  feedback: string;
  isExit: boolean;
}

export interface ScenarioPhase {
  messages: ScenarioMessage[];
  choices: ScenarioChoice[];
  revealedRedFlags: string[];
}

export interface RealCase {
  title: string;
  loss: string;
  description: string;
  source: string;
  year: number;
}

export interface PhishingScenario {
  id: string;
  title: string;
  subtitle: string;
  type: ScenarioType;
  difficulty: Difficulty;
  icon: string;
  color: string;
  bgColor: string;
  callerInfo: string;
  avgLoss: string;
  victimProfile: string;
  phases: ScenarioPhase[];
  allRedFlags: string[];
  preventionTips: string[];
  realCase: RealCase;
}

// ─── Quiz Types ─────────────────────────────────────

export interface QuizQuestion {
  id: string;
  type: "sms" | "call" | "link" | "message";
  content: string;
  sender: string;
  isPhishing: boolean;
  explanation: string;
  redFlags?: string[];
}

// ─── Stats Types ────────────────────────────────────

export interface YearlyStats {
  year: number;
  cases: number;
  totalLoss: number;
  avgLoss: number;
}

export interface ScamTypeStats {
  type: string;
  percentage: number;
  color: string;
}

// ─── User Progress ──────────────────────────────────

export interface UserProgress {
  completedScenarios: string[];
  quizScore: number;
  quizTotal: number;
  totalRedFlagsFound: number;
  totalRedFlagsMissed: number;
  completedAt: string;
}

export const SCENARIO_TYPE_LABELS: Record<ScenarioType, string> = {
  call: "전화",
  sms: "문자",
  kakaotalk: "메신저",
};

export const SCENARIO_TYPE_ICONS: Record<ScenarioType, string> = {
  call: "📞",
  sms: "💬",
  kakaotalk: "💛",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: "쉬움",
  2: "보통",
  3: "어려움",
};

export const SAFETY_CONFIG: Record<Safety, { label: string; color: string; bgColor: string }> = {
  safe: { label: "안전", color: "#10B981", bgColor: "#ECFDF5" },
  caution: { label: "주의", color: "#F59E0B", bgColor: "#FFFBEB" },
  danger: { label: "위험", color: "#EF4444", bgColor: "#FEF2F2" },
};
