"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Shield,
  Phone,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  MessageSquare,
  Link as LinkIcon,
  CreditCard,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  ArrowRight,
  Square,
  CheckSquare,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────

const GOLDEN_RULES = [
  {
    emoji: "\uD83D\uDCDE",
    title: "\uBAA8\uB974\uB294 \uBC88\uD638\uB294 \uC758\uC2EC\uD558\uC138\uC694",
    description: "\uAC80\uCC30, \uACBD\uCC30, \uAE08\uAC10\uC6D0 \uB4F1 \uACF5\uACF5\uAE30\uAD00\uC740 \uC808\uB300 \uC804\uD654\uB85C \uAC1C\uC778\uC815\uBCF4\uB97C \uC694\uAD6C\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
    icon: <Phone className="w-6 h-6" />,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    emoji: "\uD83D\uDD17",
    title: "\uBB38\uC790 \uC18D \uB9C1\uD06C\uB294 \uD074\uB9AD\uD558\uC9C0 \uB9C8\uC138\uC694",
    description: "\uD0DD\uBC30, \uACF5\uACF5\uAE30\uAD00, \uC740\uD589 \uBB38\uC790\uC758 \uB9C1\uD06C\uB294 \uC9C1\uC811 \uACF5\uC2DD \uC571\uC774\uB098 \uC6F9\uC0AC\uC774\uD2B8\uC5D0\uC11C \uD655\uC778\uD558\uC138\uC694.",
    icon: <LinkIcon className="w-6 h-6" />,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    emoji: "\uD83D\uDCB3",
    title: "\uC804\uD654\uB85C \uAC1C\uC778\uC815\uBCF4\uB97C \uC808\uB300 \uC54C\uB824\uC8FC\uC9C0 \uB9C8\uC138\uC694",
    description: "\uC8FC\uBBFC\uB4F1\uB85D\uBC88\uD638, \uACC4\uC88C\uBC88\uD638, \uBE44\uBC00\uBC88\uD638 \uB4F1\uC744 \uC804\uD654\uB85C \uBB3B\uB294 \uAC83\uC740 100% \uC0AC\uAE30\uC785\uB2C8\uB2E4.",
    icon: <CreditCard className="w-6 h-6" />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    emoji: "\uD83D\uDCB8",
    title: "'\uC548\uC804\uACC4\uC88C'\uB294 \uC874\uC7AC\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4",
    description: "\uAD6D\uAC00\uAE30\uAD00\uC774 \uC548\uC804\uACC4\uC88C\uB85C \uB3C8\uC744 \uC774\uCCB4\uD558\uB77C\uACE0 \uD558\uBA74 \uBB34\uC870\uAC74 \uC0AC\uAE30\uC785\uB2C8\uB2E4.",
    icon: <DollarSign className="w-6 h-6" />,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  {
    emoji: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67",
    title: "\uAC00\uC871\uC774 \uB3C8\uC744 \uC694\uAD6C\uD558\uBA74 \uC9C1\uC811 \uC804\uD654\uB85C \uD655\uC778\uD558\uC138\uC694",
    description: "\uD3F0\uC774 \uACE0\uC7A5\uB0AC\uB2E4\uBA70 \uB2E4\uB978 \uBC88\uD638\uB85C \uC5F0\uB77D\uD558\uBA74, \uAE30\uC874 \uBC88\uD638\uB85C \uC9C1\uC811 \uC804\uD654\uD574 \uD655\uC778\uD558\uC138\uC694.",
    icon: <Users className="w-6 h-6" />,
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
  },
];

interface PhishingTypeGuide {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  method: string;
  example: string;
  response: string[];
}

const PHISHING_TYPE_GUIDES: PhishingTypeGuide[] = [
  {
    id: "institution",
    title: "\uAE30\uAD00 \uC0AC\uCE6D (\uAC80\uCC30/\uACBD\uCC30/\uAE08\uAC10\uC6D0)",
    icon: <Shield className="w-5 h-5" />,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    method: "\uAC80\uCC30\uC774\uB098 \uACBD\uCC30\uC744 \uC0AC\uCE6D\uD558\uC5EC '\uACC4\uC88C\uAC00 \uBC94\uC8C4\uC5D0 \uC5F0\uB8E8\uB418\uC5C8\uB2E4', '\uC2E0\uBD84\uC774 \uB3C4\uC6A9\uB418\uC5C8\uB2E4'\uBA70 \uACF5\uD3EC\uAC10\uC744 \uC870\uC131\uD569\uB2C8\uB2E4. '\uBE44\uBC00 \uC720\uC9C0'\uB97C \uAC15\uC694\uD558\uACE0 '\uC548\uC804\uACC4\uC88C'\uB85C \uC774\uCCB4\uB97C \uC694\uAD6C\uD569\uB2C8\uB2E4.",
    example: "\"\uC11C\uC6B8\uC911\uC559\uC9C0\uAC80 \uAE08\uC735\uBC94\uC8C4\uC218\uC0AC\uBD80\uC785\uB2C8\uB2E4. \uADC0\uD558 \uBA85\uC758 \uACC4\uC88C\uAC00 \uC0AC\uAE30 \uC0AC\uAC74\uC5D0 \uC0AC\uC6A9\uB41C \uC815\uD669\uC774 \uD3EC\uCC29\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uBE44\uBC00\uC744 \uC720\uC9C0\uD558\uC2DC\uACE0, \uC790\uAE08\uC744 \uC548\uC804\uACC4\uC88C\uB85C \uC774\uCCB4\uD574\uC8FC\uC2ED\uC2DC\uC624.\"",
    response: [
      "\uC989\uC2DC \uC804\uD654\uB97C \uB04A\uC73C\uC138\uC694",
      "\uD574\uB2F9 \uAE30\uAD00\uC758 \uACF5\uC2DD \uBC88\uD638\uB85C \uC9C1\uC811 \uC804\uD654\uD558\uC5EC \uD655\uC778\uD558\uC138\uC694",
      "\uAC00\uC871\uC774\uB098 \uC9C0\uC778\uC5D0\uAC8C \uC0C1\uD669\uC744 \uC54C\uB9AC\uC138\uC694",
      "112\uC5D0 \uC2E0\uACE0\uD558\uC138\uC694",
    ],
  },
  {
    id: "loan",
    title: "\uB300\uCD9C \uC0AC\uAE30",
    icon: <DollarSign className="w-5 h-5" />,
    color: "text-sky-600",
    bg: "bg-sky-50",
    method: "\uC740\uD589\uC744 \uC0AC\uCE6D\uD558\uC5EC '\uCD08\uC800\uAE08\uB9AC \uB300\uD658\uB300\uCD9C'\uC744 \uC81C\uC548\uD569\uB2C8\uB2E4. \uAE30\uC874 \uB300\uCD9C\uAE08\uC744 '\uC120\uC0C1\uD658'\uD558\uB77C\uACE0 \uC694\uAD6C\uD558\uAC70\uB098 \uC218\uC218\uB8CC\u00B7\uACF5\uD0C1\uAE08 \uB4F1\uC758 \uBA85\uBAA9\uC73C\uB85C \uB3C8\uC744 \uC785\uAE08\uC2DC\uD0B5\uB2C8\uB2E4.",
    example: "\"OO\uC740\uD589\uC785\uB2C8\uB2E4. \uACE0\uAC1D\uB2D8 \uC2E0\uC6A9\uB4F1\uAE09\uC73C\uB85C \uC5F0 2.5% \uB300\uD658\uB300\uCD9C\uC774 \uAC00\uB2A5\uD569\uB2C8\uB2E4. \uAE30\uC874 \uB300\uCD9C\uAE08\uC744 \uBA3C\uC800 \uC0C1\uD658\uD558\uC2DC\uBA74 \uC988\uC2DC \uC2E4\uD589\uB429\uB2C8\uB2E4.\"",
    response: [
      "\uC740\uD589\uC740 \uC808\uB300 \uC804\uD654\uB85C \uBA3C\uC800 \uB300\uCD9C\uC744 \uAD8C\uC720\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4",
      "'\uC120\uC0C1\uD658' \uC694\uAD6C\uB294 100% \uC0AC\uAE30\uC785\uB2C8\uB2E4",
      "\uC740\uD589 \uC601\uC5C5\uC810\uC5D0 \uC9C1\uC811 \uBC29\uBB38\uD558\uC5EC \uD655\uC778\uD558\uC138\uC694",
      "\uAE08\uAC10\uC6D0 1332\uC5D0\uC11C \uB4F1\uB85D \uC5EC\uBD80\uB97C \uD655\uC778\uD558\uC138\uC694",
    ],
  },
  {
    id: "family",
    title: "\uAC00\uC871/\uC9C0\uC778 \uC0AC\uCE6D",
    icon: <Users className="w-5 h-5" />,
    color: "text-pink-600",
    bg: "bg-pink-50",
    method: "\uC790\uB140\uB098 \uAC00\uC871\uC744 \uC0AC\uCE6D\uD558\uC5EC '\uD3F0\uC774 \uACE0\uC7A5\uB0AC\uB2E4', '\uAE09\uD558\uAC8C \uB3C8\uC774 \uD544\uC694\uD558\uB2E4'\uBA70 \uC1A1\uAE08\uC774\uB098 \uC0C1\uD488\uAD8C \uD540\uBC88\uD638\uB97C \uC694\uAD6C\uD569\uB2C8\uB2E4. \uC0C8 \uBC88\uD638\uB85C \uC5F0\uB77D\uD558\uBA70 \uC9C1\uC811 \uD1B5\uD654\uB97C \uD53C\uD569\uB2C8\uB2E4.",
    example: "\"\uC5C4\uB9C8 \uB098 \uBBFC\uC218\uC57C. \uD3F0 \uC561\uC815\uC774 \uAE68\uC838\uC11C \uCE5C\uAD6C \uD3F0\uC73C\uB85C \uBCF4\uB0B4. \uC218\uB9AC\uBE44 50\uB9CC\uC6D0\uB9CC \uBCF4\uB0B4\uC904 \uC218 \uC788\uC5B4? \uACC4\uC88C\uBC88\uD638 \uBCF4\uB0B4\uC904\uAC8C.\"",
    response: [
      "\uAE30\uC874 \uBC88\uD638\uB85C \uC9C1\uC811 \uC804\uD654\uD558\uC5EC \uD655\uC778\uD558\uC138\uC694",
      "\uC601\uC0C1\uD1B5\uD654\uB97C \uC694\uCCAD\uD558\uBA74 \uC0AC\uAE30\uBC94\uC740 \uB300\uC751\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4",
      "\uC608\uAE08\uC8FC \uC774\uB984\uC774 \uAC00\uC871\uACFC \uB2E4\uB974\uBA74 100% \uC0AC\uAE30\uC785\uB2C8\uB2E4",
      "\uAC00\uC871 \uAC04 '\uBE44\uBC00 \uD655\uC778 \uC9C8\uBB38'\uC744 \uBBF8\uB9AC \uC815\uD574\uB450\uC138\uC694",
    ],
  },
  {
    id: "delivery",
    title: "\uD0DD\uBC30/\uC1FC\uD551 \uC0AC\uCE6D",
    icon: <Package className="w-5 h-5" />,
    color: "text-amber-600",
    bg: "bg-amber-50",
    method: "\uD0DD\uBC30 \uBBF8\uC218\uCDE8, \uBC30\uC1A1 \uC2E4\uD328 \uB4F1\uC744 \uBE59\uBBF8\uB85C \uAC00\uC9DC \uB9C1\uD06C\uB97C \uBCF4\uB0C5\uB2C8\uB2E4. \uB9C1\uD06C \uD074\uB9AD \uC2DC \uC545\uC131 \uC571\uC774 \uC124\uCE58\uB418\uC5B4 \uAC1C\uC778\uC815\uBCF4\uC640 \uAE08\uC735\uC815\uBCF4\uB97C \uD0C8\uCDE8\uD569\uB2C8\uB2E4.",
    example: "[CJ\uB300\uD55C\uD1B5\uC6B4] \uACE0\uAC1D\uB2D8 \uD0DD\uBC30\uAC00 \uC8FC\uC18C \uBD88\uC77C\uCE58\uB85C \uBC18\uC1A1 \uC608\uC815. \uC8FC\uC18C \uD655\uC778: https://cj-delvry.xyz/track",
    response: [
      "\uBB38\uC790 \uC18D URL\uC740 \uC808\uB300 \uD074\uB9AD\uD558\uC9C0 \uB9C8\uC138\uC694",
      "\uACF5\uC2DD \uC571(CJ\uB300\uD55C\uD1B5\uC6B4, \uC6B0\uCCB4\uAD6D \uB4F1)\uC5D0\uC11C \uC9C1\uC811 \uC870\uD68C\uD558\uC138\uC694",
      "\uCD9C\uCC98 \uBD88\uBA85 \uC571\uC740 \uC808\uB300 \uC124\uCE58\uD558\uC9C0 \uB9C8\uC138\uC694",
      "118(\uC778\uD130\uB137\uC9C4\uD765\uC6D0)\uC5D0 \uC2E0\uACE0\uD558\uC138\uC694",
    ],
  },
  {
    id: "investment",
    title: "\uD22C\uC790 \uC0AC\uAE30",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    method: "\uB2E8\uD1A1\uBC29\uC5D0 \uCD08\uB300\uD558\uC5EC \uB192\uC740 \uC218\uC775\uB960\uC744 \uBCF4\uC7A5\uD569\uB2C8\uB2E4. \uC18C\uC561 \uCCB4\uD5D8\uC73C\uB85C \uC2E4\uC81C \uC218\uC775\uC744 \uC8FC\uC5B4 \uC2E0\uB8B0\uB97C \uC313\uC740 \uD6C4, \uD070 \uAE08\uC561\uC744 \uD22C\uC790\uD558\uAC8C \uB9CC\uB4ED\uB2C8\uB2E4. \uC774\uD6C4 \uCD9C\uAE08\uC744 \uCC28\uB2E8\uD558\uACE0 \uC7A0\uC801\uD569\uB2C8\uB2E4.",
    example: "\"\uD83D\uDD14 \uC624\uB298\uC758 \uCD94\uCC9C\uC885\uBAA9 +35% \uBAA9\uD45C! \uC804\uBB38\uAC00 \uBB34\uB8CC \uCCB4\uD5D8 \uD22C\uC790 \uC2E0\uADDC \uD68C\uC6D0 3\uBA85 \uB0A8\uC558\uC2B5\uB2C8\uB2E4!\"",
    response: [
      "\uD22C\uC790 \uC218\uC775 \uBCF4\uC7A5\uC740 \uC790\uBCF8\uC2DC\uC7A5\uBC95 \uC704\uBC18 \u2014 100% \uC0AC\uAE30\uC785\uB2C8\uB2E4",
      "\uBAA8\uB974\uB294 \uB2E8\uD1A1\uBC29 \uCD08\uB300\uB294 \uC989\uC2DC \uB098\uAC00\uC138\uC694",
      "\uD22C\uC790\uB294 \uAE08\uAC10\uC6D0 \uB4F1\uB85D \uACF5\uC2DD \uC99D\uAD8C\uC0AC\uB97C \uD1B5\uD574\uC11C\uB9CC",
      "\uAE08\uAC10\uC6D0 1332 \uB610\uB294 112\uC5D0 \uC2E0\uACE0\uD558\uC138\uC694",
    ],
  },
];

const EMERGENCY_CONTACTS = [
  {
    number: "112",
    label: "\uACBD\uCC30",
    description: "\uC0AC\uAE30 \uC2E0\uACE0",
    color: "bg-blue-600 hover:bg-blue-700",
    ring: "ring-blue-200",
  },
  {
    number: "1332",
    label: "\uAE08\uC735\uAC10\uB3C5\uC6D0",
    description: "\uAE08\uC735\uC0AC\uAE30 \uC0C1\uB2F4",
    color: "bg-indigo-600 hover:bg-indigo-700",
    ring: "ring-indigo-200",
  },
  {
    number: "118",
    label: "\uC778\uD130\uB137\uC9C4\uD765\uC6D0",
    description: "\uC2A4\uBBF8\uC2F1 \uC2E0\uACE0",
    color: "bg-teal-600 hover:bg-teal-700",
    ring: "ring-teal-200",
  },
  {
    number: "1899-0020",
    label: "\uBCF4\uC774\uC2A4\uD53C\uC2F1 \uD53C\uD574 \uC2E0\uACE0",
    description: "\uD53C\uD574 \uC2E0\uACE0 \uC804\uC6A9",
    color: "bg-red-600 hover:bg-red-700",
    ring: "ring-red-200",
  },
];

const CHECKLIST_ITEMS = [
  "\uC2A4\uB9C8\uD2B8\uD3F0\uC5D0 '\uC54C \uC218 \uC5C6\uB294 \uC571' \uC124\uCE58 \uCC28\uB2E8 \uC124\uC815\uD588\uB098\uC694?",
  "\uAC00\uC871\uACFC \uBE44\uBC00 \uD655\uC778 \uC9C8\uBB38\uC744 \uC815\uD588\uB098\uC694?",
  "\uAE08\uC735 \uC571\uC5D0 \uC774\uCCB4 \uD55C\uB3C4\uB97C \uC124\uC815\uD588\uB098\uC694?",
  "\uACBD\uCC30\uCCAD '\uC2DC\uD2F0\uC988\uCF54\uB09C' \uC571\uC744 \uC124\uCE58\uD588\uB098\uC694?",
  "\uC8FC\uC694 \uAE08\uC735\uAE30\uAD00 \uACF5\uC2DD \uC804\uD654\uBC88\uD638\uB97C \uC800\uC7A5\uD588\uB098\uC694?",
  "\uBB38\uC790 \uC18D \uB9C1\uD06C\uB97C \uD074\uB9AD\uD558\uC9C0 \uC54A\uB294 \uC2B5\uAD00\uC744 \uB4E4\uC600\uB098\uC694?",
  "\uAC00\uC871\uB4E4\uC5D0\uAC8C \uBCF4\uC774\uC2A4\uD53C\uC2F1 \uC608\uBC29\uBC95\uC744 \uC54C\uB824\uC92C\uB098\uC694?",
  "\uC740\uD589 \uACC4\uC88C \uC774\uC0C1 \uAC70\uB798 \uC54C\uB9BC \uC124\uC815\uC744 \uD588\uB098\uC694?",
];

const ELDERLY_TIPS = [
  {
    title: "\uBAA8\uB974\uB294 \uC804\uD654\uB294 \uBC1B\uC9C0 \uB9C8\uC138\uC694",
    description: "\uAC80\uCC30, \uACBD\uCC30\uC774\uB77C\uACE0 \uD574\uB3C4 \uC804\uD654\uB85C \uB3C8 \uC774\uC57C\uAE30 \uD558\uBA74 \uC0AC\uAE30\uC785\uB2C8\uB2E4.",
  },
  {
    title: "\uB3C8 \uBCF4\uB0B4\uB77C\uB294 \uC804\uD654\uB294 \uB04A\uC73C\uC138\uC694",
    description: "'\uC548\uC804\uACC4\uC88C', '\uBCF4\uD638\uC870\uCE58' \uAC19\uC740 \uB9D0\uC740 \uBAA8\uB450 \uAC70\uC9D3\uB9D0\uC785\uB2C8\uB2E4.",
  },
  {
    title: "\uC790\uB140\uAC00 \uB3C8 \uBCF4\uB0B4\uB2EC\uB77C\uACE0 \uD558\uBA74, \uC6D0\uB798 \uBC88\uD638\uB85C \uC804\uD654\uD558\uC138\uC694",
    description: "\uD3F0\uC774 \uACE0\uC7A5\uB0AC\uB2E4\uB294 \uB9D0\uC744 \uBBFF\uC9C0 \uB9C8\uC138\uC694.",
  },
  {
    title: "\uBB38\uC790\uC5D0 \uC788\uB294 \uD30C\uB780\uC0C9 \uAE00\uC790(\uB9C1\uD06C)\uB97C \uB204\uB974\uC9C0 \uB9C8\uC138\uC694",
    description: "\uB204\uB974\uBA74 \uB098\uC05C \uD504\uB85C\uADF8\uB7A8\uC774 \uC124\uCE58\uB420 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  },
  {
    title: "\uC758\uC2EC\uB418\uBA74 112\uC5D0 \uC804\uD654\uD558\uC138\uC694",
    description: "112\uB294 \uACBD\uCC30\uC785\uB2C8\uB2E4. \uC5B8\uC81C\uB4E0 \uB3C4\uC640\uC90D\uB2C8\uB2E4.",
  },
];

const CHECKLIST_STORAGE_KEY = "pz_guide_checklist";

function getStoredChecklist(): boolean[] {
  if (typeof window === "undefined") return new Array(CHECKLIST_ITEMS.length).fill(false);
  try {
    const stored = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as boolean[];
      if (parsed.length === CHECKLIST_ITEMS.length) return parsed;
    }
  } catch {
    // ignore
  }
  return new Array(CHECKLIST_ITEMS.length).fill(false);
}

export default function GuidePage() {
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<boolean[]>(() => getStoredChecklist());

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checklist));
    }
  }, [checklist]);

  const toggleCheck = useCallback((index: number) => {
    setChecklist((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }, []);

  const checkedCount = checklist.filter(Boolean).length;

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 animate-[slide-up_0.6s_ease-out]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            예방 가이드
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">
            보이스피싱 예방 완전 가이드
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            알면 막을 수 있습니다. 핵심 예방법부터 긴급 연락처까지
            <br className="hidden sm:block" />
            보이스피싱 대응의 모든 것을 안내합니다.
          </p>
        </header>

        {/* Golden Rules */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-600" />
            5가지 황금 수칙
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GOLDEN_RULES.map((rule, idx) => (
              <div
                key={idx}
                className={`${rule.bg} border ${rule.border} rounded-2xl p-6 card-hover ${
                  idx === 4 ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 ${rule.color}`}>
                    {rule.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900 mb-1 flex items-center gap-2">
                      <span>{rule.emoji}</span>
                      {rule.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{rule.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Type-specific Guide Accordion */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning-600" />
            유형별 수법 & 대응법
          </h2>

          <div className="space-y-3">
            {PHISHING_TYPE_GUIDES.map((guide) => {
              const isExpanded = expandedType === guide.id;
              return (
                <div
                  key={guide.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setExpandedType(isExpanded ? null : guide.id)}
                    className="w-full text-left p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl ${guide.bg} flex items-center justify-center flex-shrink-0 ${guide.color}`}>
                      {guide.icon}
                    </div>
                    <span className="font-semibold text-navy-900 flex-1">{guide.title}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-6 animate-[fade-in_0.3s_ease-out]">
                      <div className="border-t border-slate-100 pt-4 space-y-5">
                        {/* Method */}
                        <div>
                          <h4 className="text-sm font-bold text-navy-800 mb-2 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4 text-danger-500" />
                            수법 설명
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed">{guide.method}</p>
                        </div>

                        {/* Example */}
                        <div>
                          <h4 className="text-sm font-bold text-navy-800 mb-2 flex items-center gap-1">
                            <MessageSquare className="w-4 h-4 text-warning-500" />
                            실제 대화 예시
                          </h4>
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <p className="text-sm text-slate-700 italic leading-relaxed">{guide.example}</p>
                          </div>
                        </div>

                        {/* Response */}
                        <div>
                          <h4 className="text-sm font-bold text-navy-800 mb-2 flex items-center gap-1">
                            <Shield className="w-4 h-4 text-success-500" />
                            대응 방법
                          </h4>
                          <ul className="space-y-2">
                            {guide.response.map((res, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                                {res}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
            <Phone className="w-5 h-5 text-danger-600" />
            긴급 연락처
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EMERGENCY_CONTACTS.map((contact) => (
              <a
                key={contact.number}
                href={`tel:${contact.number}`}
                className={`${contact.color} text-white rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:shadow-lg active:scale-[0.98] ring-2 ${contact.ring} ring-offset-2`}
              >
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold">{contact.number}</div>
                  <div className="text-sm font-medium opacity-90">{contact.label}</div>
                  <div className="text-xs opacity-70">{contact.description}</div>
                </div>
                <ExternalLink className="w-5 h-5 ml-auto opacity-60 flex-shrink-0" />
              </a>
            ))}
          </div>
        </section>

        {/* Checklist */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy-900 mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success-600" />
            피싱 예방 체크리스트
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            체크한 내용은 자동으로 저장됩니다 ({checkedCount}/{CHECKLIST_ITEMS.length} 완료)
          </p>

          {/* Progress */}
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-success-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(checkedCount / CHECKLIST_ITEMS.length) * 100}%` }}
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
            {CHECKLIST_ITEMS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => toggleCheck(idx)}
                className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
              >
                {checklist[idx] ? (
                  <CheckSquare className="w-5 h-5 text-success-600 flex-shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300 flex-shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    checklist[idx] ? "text-slate-400 line-through" : "text-slate-700"
                  }`}
                >
                  {item}
                </span>
              </button>
            ))}
          </div>

          {checkedCount === CHECKLIST_ITEMS.length && (
            <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-xl text-center animate-[slide-up_0.4s_ease-out]">
              <p className="text-success-700 font-semibold">
                {"\uD83C\uDF89"} 모든 체크리스트를 완료했습니다! 보이스피싱 예방 준비 완료!
              </p>
            </div>
          )}
        </section>

        {/* For Elderly */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-600" />
            어르신을 위한 쉬운 가이드
          </h2>

          <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-6 md:p-8">
            <p className="text-primary-800 font-semibold text-lg mb-6">
              {"\uD83D\uDC74\uD83D\uDC75"} 아래 5가지만 기억하세요!
            </p>

            <div className="space-y-5">
              {ELDERLY_TIPS.map((tip, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-5 border border-primary-100 shadow-sm"
                >
                  <h3 className="font-bold text-navy-900 text-lg mb-2">
                    <span className="text-primary-600 mr-2">{idx + 1}.</span>
                    {tip.title}
                  </h3>
                  <p className="text-slate-600 text-base leading-relaxed">{tip.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-white rounded-xl border border-primary-200 text-center">
              <p className="text-lg font-bold text-danger-600">
                {"\uD83D\uDCDE"} 의심되면 지금 바로 112에 전화하세요!
              </p>
              <a
                href="tel:112"
                className="mt-3 inline-flex items-center gap-2 px-6 py-3 bg-danger-600 hover:bg-danger-700 text-white font-bold rounded-xl text-lg transition-colors active:scale-[0.98]"
              >
                <Phone className="w-5 h-5" />
                112 전화하기
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 md:p-12">
          <Shield className="w-12 h-12 text-white/80 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            직접 체험하며 배워보세요
          </h2>
          <p className="text-primary-100 mb-8 max-w-md mx-auto">
            시뮬레이션으로 실제 보이스피싱 상황을 체험하고
            <br />
            올바른 대응법을 익혀보세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/simulation"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-primary-700 font-semibold rounded-2xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              체험 시뮬레이션
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500/30 hover:bg-primary-500/40 text-white font-semibold rounded-2xl text-lg transition-all duration-300"
            >
              피싱 판별 퀴즈
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
