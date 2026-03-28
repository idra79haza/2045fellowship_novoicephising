"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { QUIZ_QUESTIONS } from "@/lib/scenarios";
import { QuizQuestion } from "@/lib/types";
import { saveQuizScore } from "@/lib/store";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Phone,
  MessageSquare,
  Link as LinkIcon,
  MessageCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
} from "lucide-react";

type Screen = "intro" | "question" | "results";

interface AnswerRecord {
  question: QuizQuestion;
  userAnswer: boolean; // true = user said phishing
  isCorrect: boolean;
}

const TYPE_CONFIG: Record<
  QuizQuestion["type"],
  { label: string; icon: React.ReactNode; bgClass: string; borderClass: string }
> = {
  sms: {
    label: "문자 메시지",
    icon: <MessageSquare className="w-5 h-5" />,
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200",
  },
  call: {
    label: "전화",
    icon: <Phone className="w-5 h-5" />,
    bgClass: "bg-purple-50",
    borderClass: "border-purple-200",
  },
  link: {
    label: "링크",
    icon: <LinkIcon className="w-5 h-5" />,
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
  },
  message: {
    label: "메신저",
    icon: <MessageCircle className="w-5 h-5" />,
    bgClass: "bg-green-50",
    borderClass: "border-green-200",
  },
};

function getGrade(score: number): { label: string; emoji: string; color: string } {
  if (score === 10) return { label: "피싱 전문가", emoji: "\uD83D\uDEE1\uFE0F", color: "text-primary-600" };
  if (score >= 8) return { label: "높은 경각심", emoji: "\uD83D\uDC4D", color: "text-success-600" };
  if (score >= 6) return { label: "조금 더 주의 필요", emoji: "\u26A0\uFE0F", color: "text-warning-600" };
  return { label: "매우 위험!", emoji: "\uD83D\uDEA8", color: "text-danger-600" };
}

export default function QuizPage() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<AnswerRecord | null>(null);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[currentIndex];

  const handleStart = useCallback(() => {
    setScreen("question");
    setCurrentIndex(0);
    setAnswers([]);
    setShowFeedback(false);
    setLastAnswer(null);
  }, []);

  const handleAnswer = useCallback(
    (userSaidPhishing: boolean) => {
      const q = QUIZ_QUESTIONS[currentIndex];
      const isCorrect = userSaidPhishing === q.isPhishing;
      const record: AnswerRecord = {
        question: q,
        userAnswer: userSaidPhishing,
        isCorrect,
      };
      setLastAnswer(record);
      setAnswers((prev) => [...prev, record]);
      setShowFeedback(true);
    },
    [currentIndex]
  );

  const handleNext = useCallback(() => {
    setShowFeedback(false);
    setLastAnswer(null);
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const score = answers.filter((a) => a.isCorrect).length;
      saveQuizScore(score, totalQuestions);
      setScreen("results");
    }
  }, [currentIndex, totalQuestions, answers]);

  const handleRestart = useCallback(() => {
    setScreen("intro");
    setCurrentIndex(0);
    setAnswers([]);
    setShowFeedback(false);
    setLastAnswer(null);
  }, []);

  const score = answers.filter((a) => a.isCorrect).length;
  const grade = getGrade(score);

  // ─── Intro Screen ─────────────────────────────────────
  if (screen === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center">
          <div className="mb-8 animate-[float_6s_ease-in-out_infinite]">
            <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-12 h-12 text-primary-600" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
            피싱 판별 퀴즈
          </h1>
          <p className="text-lg text-slate-600 mb-2">
            10문제로 확인하는 나의 피싱 판별력
          </p>
          <p className="text-sm text-slate-400 mb-10">
            실제 사례 기반의 문자, 전화, 링크, 메시지를 보고
            <br />
            피싱인지 정상인지 판별해 보세요.
          </p>

          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl text-lg transition-all duration-300 shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            퀴즈 시작하기
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" /> 문자
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" /> 전화
            </span>
            <span className="flex items-center gap-1">
              <LinkIcon className="w-4 h-4" /> 링크
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> 메신저
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ─── Question Screen ──────────────────────────────────
  if (screen === "question") {
    const typeConf = TYPE_CONFIG[currentQuestion.type];
    const progress = ((currentIndex + (showFeedback ? 1 : 0)) / totalQuestions) * 100;

    return (
      <div className="min-h-screen px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500">
                {currentIndex + 1} / {totalQuestions}
              </span>
              <span className="text-sm font-medium text-primary-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-6">
            {/* Type Badge */}
            <div className={`px-6 py-3 ${typeConf.bgClass} border-b ${typeConf.borderClass} flex items-center gap-2`}>
              {typeConf.icon}
              <span className="text-sm font-medium text-slate-700">{typeConf.label}</span>
              <span className="ml-auto text-xs text-slate-400">보낸 사람: {currentQuestion.sender}</span>
            </div>

            {/* Message Mockup */}
            <div className="p-6">
              <div className={`p-5 rounded-xl border ${typeConf.borderClass} ${typeConf.bgClass}`}>
                {currentQuestion.type === "link" ? (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">링크 URL</p>
                    <p className="font-mono text-sm text-blue-700 break-all">{currentQuestion.content}</p>
                  </div>
                ) : currentQuestion.type === "call" ? (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">{currentQuestion.sender}</p>
                      <p className="text-slate-800 leading-relaxed">&quot;{currentQuestion.content}&quot;</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-slate-400 mb-2">{currentQuestion.sender}</p>
                    <p className="text-slate-800 leading-relaxed">{currentQuestion.content}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Answer Buttons */}
          {!showFeedback && (
            <div className="grid grid-cols-2 gap-4 mb-6 animate-[fade-in_0.3s_ease-out]">
              <button
                onClick={() => handleAnswer(true)}
                className="p-5 bg-white border-2 border-danger-200 hover:border-danger-400 hover:bg-danger-50 rounded-2xl transition-all duration-200 text-center group active:scale-[0.98]"
              >
                <span className="text-3xl block mb-2">{"\uD83D\uDEA8"}</span>
                <span className="font-semibold text-danger-700 group-hover:text-danger-800">피싱이다!</span>
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="p-5 bg-white border-2 border-success-200 hover:border-success-400 hover:bg-success-50 rounded-2xl transition-all duration-200 text-center group active:scale-[0.98]"
              >
                <span className="text-3xl block mb-2">{"\u2705"}</span>
                <span className="font-semibold text-success-700 group-hover:text-success-800">정상이다!</span>
              </button>
            </div>
          )}

          {/* Feedback */}
          {showFeedback && lastAnswer && (
            <div className="animate-[slide-up_0.4s_ease-out]">
              <div
                className={`p-6 rounded-2xl border-2 mb-6 ${
                  lastAnswer.isCorrect
                    ? "bg-success-50 border-success-300"
                    : "bg-danger-50 border-danger-300"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {lastAnswer.isCorrect ? (
                    <CheckCircle className="w-7 h-7 text-success-600" />
                  ) : (
                    <XCircle className="w-7 h-7 text-danger-600" />
                  )}
                  <span
                    className={`text-lg font-bold ${
                      lastAnswer.isCorrect ? "text-success-700" : "text-danger-700"
                    }`}
                  >
                    {lastAnswer.isCorrect ? "정답입니다!" : "틀렸습니다!"}
                  </span>
                </div>

                <p className="text-slate-700 mb-1">
                  이 메시지는{" "}
                  <strong className={lastAnswer.question.isPhishing ? "text-danger-600" : "text-success-600"}>
                    {lastAnswer.question.isPhishing ? "피싱" : "정상"}
                  </strong>
                  입니다.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">{lastAnswer.question.explanation}</p>

                {lastAnswer.question.isPhishing && lastAnswer.question.redFlags && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-sm font-semibold text-danger-700 mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      위험 신호
                    </p>
                    <ul className="space-y-1">
                      {lastAnswer.question.redFlags.map((flag, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-danger-400 mt-0.5">&#x2022;</span>
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={handleNext}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {currentIndex + 1 < totalQuestions ? "다음 문제" : "결과 보기"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Results Screen ───────────────────────────────────
  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Score Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10 text-center mb-8 animate-[slide-up_0.6s_ease-out]">
          <div className="text-5xl mb-4">{grade.emoji}</div>
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${grade.color}`}>
            {grade.label}
          </h2>
          <div className="mt-6 mb-4">
            <div className="text-6xl md:text-7xl font-extrabold text-navy-900">
              {score}
              <span className="text-2xl md:text-3xl text-slate-400 font-medium">
                {" "}
                / {totalQuestions}
              </span>
            </div>
          </div>

          {/* Score Bar */}
          <div className="w-full max-w-xs mx-auto h-3 bg-slate-200 rounded-full overflow-hidden mt-4 mb-6">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                score >= 8 ? "bg-success-500" : score >= 6 ? "bg-warning-500" : "bg-danger-500"
              }`}
              style={{ width: `${(score / totalQuestions) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-1 text-success-600">
              <CheckCircle className="w-4 h-4" />
              <span>맞은 문제: {score}개</span>
            </div>
            <div className="flex items-center gap-1 text-danger-600">
              <XCircle className="w-4 h-4" />
              <span>틀린 문제: {totalQuestions - score}개</span>
            </div>
          </div>
        </div>

        {/* Answer Review */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary-600" />
            문제 리뷰
          </h3>
          <div className="space-y-3">
            {answers.map((ans, idx) => {
              const tConf = TYPE_CONFIG[ans.question.type];
              return (
                <div
                  key={ans.question.id}
                  className={`bg-white rounded-xl border p-4 ${
                    ans.isCorrect ? "border-success-200" : "border-danger-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                        ans.isCorrect
                          ? "bg-success-100 text-success-700"
                          : "bg-danger-100 text-danger-700"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${tConf.bgClass} text-slate-600`}>
                          {tConf.label}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            ans.question.isPhishing ? "text-danger-600" : "text-success-600"
                          }`}
                        >
                          {ans.question.isPhishing ? "피싱" : "정상"}
                        </span>
                        {ans.isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-success-500 ml-auto flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-danger-500 ml-auto flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-1">{ans.question.content}</p>
                      <p className="text-xs text-slate-400">{ans.question.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleRestart}
            className="py-4 px-6 bg-white border-2 border-slate-200 hover:border-primary-300 text-slate-700 hover:text-primary-700 font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            다시 도전하기
          </button>
          <Link
            href="/simulation"
            className="py-4 px-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary-600/25"
          >
            체험 시뮬레이션 도전하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
