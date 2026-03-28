"use client";

import { UserProgress } from "./types";

const KEYS = {
  progress: "pz_progress",
  quizAnswers: "pz_quiz_answers",
} as const;

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Progress ────────────────────────────────────────

export function getProgress(): UserProgress {
  return getItem<UserProgress>(KEYS.progress, {
    completedScenarios: [],
    quizScore: 0,
    quizTotal: 0,
    totalRedFlagsFound: 0,
    totalRedFlagsMissed: 0,
    completedAt: "",
  });
}

export function completeScenario(scenarioId: string, redFlagsFound: number, redFlagsMissed: number): void {
  const progress = getProgress();
  if (!progress.completedScenarios.includes(scenarioId)) {
    progress.completedScenarios.push(scenarioId);
  }
  progress.totalRedFlagsFound += redFlagsFound;
  progress.totalRedFlagsMissed += redFlagsMissed;
  progress.completedAt = new Date().toISOString();
  setItem(KEYS.progress, progress);
}

export function saveQuizScore(score: number, total: number): void {
  const progress = getProgress();
  progress.quizScore = score;
  progress.quizTotal = total;
  progress.completedAt = new Date().toISOString();
  setItem(KEYS.progress, progress);
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.progress);
  localStorage.removeItem(KEYS.quizAnswers);
}
