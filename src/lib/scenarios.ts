import { PhishingScenario, QuizQuestion, YearlyStats, ScamTypeStats } from "./types";

export const SCENARIOS: PhishingScenario[] = [
  // ─── 1. 검찰 사칭 전화 ─────────────────────────────
  {
    id: "prosecution",
    title: "검찰 사칭 전화",
    subtitle: "당신의 계좌가 범죄에 연루되었다?",
    type: "call",
    difficulty: 2,
    icon: "⚖️",
    color: "#6366F1",
    bgColor: "#EEF2FF",
    callerInfo: "02-3480-XXXX (서울중앙지검)",
    avgLoss: "평균 피해액 2,300만원",
    victimProfile: "50~60대 피해자 비중 43%",
    phases: [
      {
        messages: [
          { sender: "system", text: "📞 02-3480-2000 (서울중앙지방검찰청)에서 전화가 왔습니다" },
          { sender: "scammer", text: "안녕하세요, 서울중앙지방검찰청 금융범죄수사부 김현수 검사입니다." },
          { sender: "scammer", text: "본인 확인을 위해 성함과 주민등록번호 뒷자리를 말씀해주시겠습니까?" },
        ],
        choices: [
          { text: "네, 홍길동이고요...", emoji: "😰", safety: "danger", feedback: "개인정보를 절대 알려주면 안 됩니다!", isExit: false },
          { text: "왜 개인정보를 요구하시죠?", emoji: "🤨", safety: "caution", feedback: "좋은 의심입니다! 하지만 아직 전화를 끊지 않았어요.", isExit: false },
          { text: "검찰은 전화로 수사하지 않습니다. 끊겠습니다.", emoji: "🛡️", safety: "safe", feedback: "정확합니다! 검찰·경찰은 절대 전화로 개인정보를 요구하지 않습니다.", isExit: true },
        ],
        revealedRedFlags: ["검찰이 전화로 직접 연락하는 경우는 없음"],
      },
      {
        messages: [
          { sender: "scammer", text: "귀하 명의의 대포통장이 사기 사건에 사용된 정황이 포착되었습니다." },
          { sender: "scammer", text: "현재 귀하도 공범 혐의 수사 대상에 포함되어 있습니다." },
          { sender: "scammer", text: "이 사실을 주변에 알리시면 증거인멸 혐의가 추가됩니다. 절대 비밀을 유지하세요." },
        ],
        choices: [
          { text: "네, 비밀 지키겠습니다. 어떻게 해야 하나요?", emoji: "😨", safety: "danger", feedback: "'비밀 유지' 요구는 대표적인 피싱 수법입니다. 주변에 반드시 알려야 합니다.", isExit: false },
          { text: "영장 없이 어떻게 수사하나요?", emoji: "🤔", safety: "caution", feedback: "좋은 질문이지만, 사기범은 이에 대한 답변도 준비해 두고 있습니다.", isExit: false },
          { text: "가족에게 먼저 확인하겠습니다. 끊겠습니다.", emoji: "🛡️", safety: "safe", feedback: "올바른 판단! 어떤 상황이든 가족이나 지인에게 먼저 알리세요.", isExit: true },
        ],
        revealedRedFlags: ["'비밀 유지' 요구 — 고립시키려는 수법", "공포감 조성으로 판단력 흐리기"],
      },
      {
        messages: [
          { sender: "scammer", text: "귀하의 계좌가 동결될 예정입니다." },
          { sender: "scammer", text: "피해를 막으려면 지금 즉시 자금을 국가 안전계좌로 이체하셔야 합니다." },
          { sender: "scammer", text: "안전계좌 번호를 불러드리겠습니다. 농협 302-XXXX-XXXX-XX 입니다." },
        ],
        choices: [
          { text: "네, 바로 이체하겠습니다", emoji: "💸", safety: "danger", feedback: "'국가 안전계좌'는 존재하지 않습니다! 이체하면 돈을 되찾기 매우 어렵습니다.", isExit: true },
          { text: "안전계좌라는 게 정말 있나요?", emoji: "🤨", safety: "caution", feedback: "의심은 좋지만 이미 너무 깊이 대화했습니다. 바로 끊고 112 신고하세요.", isExit: true },
          { text: "112에 직접 확인 후 연락드리겠습니다", emoji: "🛡️", safety: "safe", feedback: "완벽한 대응! 의심되면 112(경찰) 또는 1332(금감원)에 직접 확인하세요.", isExit: true },
        ],
        revealedRedFlags: ["'국가 안전계좌'는 존재하지 않음", "즉시 이체 요구 — 급박함 조성"],
      },
    ],
    allRedFlags: [
      "검찰·경찰이 전화로 직접 수사하는 경우는 없음",
      "전화로 주민등록번호 등 개인정보 요구",
      "'비밀 유지' 강요 — 주변인과 고립시키려는 수법",
      "공포감 조성 (공범 혐의, 계좌 동결)",
      "'국가 안전계좌'는 존재하지 않음",
      "즉시 이체를 요구하며 급박함 조성",
    ],
    preventionTips: [
      "검찰·경찰·금감원은 절대 전화로 개인정보를 요구하지 않습니다",
      "의심되면 전화를 끊고 해당 기관에 직접 전화하여 확인하세요",
      "어떤 상황이든 가족이나 지인에게 먼저 상의하세요",
      "'국가 안전계좌'는 존재하지 않습니다 — 누가 말해도 사기입니다",
      "당황하지 말고, 112 또는 금감원 1332에 즉시 신고하세요",
    ],
    realCase: {
      title: "70대 여성, 검찰 사칭에 3억원 피해",
      loss: "3억 2천만원",
      description: "검찰 수사관을 사칭한 범인이 '계좌가 범죄에 이용됐다'며 70대 여성에게 수차례 안전계좌 이체를 요구. 피해자는 퇴직금과 노후자금 전부를 잃었다.",
      source: "경찰청 2025년 보이스피싱 피해 사례집",
      year: 2025,
    },
  },

  // ─── 2. 택배 사칭 문자 ─────────────────────────────
  {
    id: "delivery",
    title: "택배 사칭 문자",
    subtitle: "배송 실패? 주소 확인 링크의 함정",
    type: "sms",
    difficulty: 1,
    icon: "📦",
    color: "#F59E0B",
    bgColor: "#FFFBEB",
    callerInfo: "010-XXXX-XXXX",
    avgLoss: "평균 피해액 580만원",
    victimProfile: "20~40대 피해자 비중 62%",
    phases: [
      {
        messages: [
          { sender: "system", text: "💬 새 문자 메시지가 도착했습니다" },
          { sender: "scammer", text: "[CJ대한통운] 고객님의 택배가 주소 불일치로 반송 예정입니다. 주소 확인: https://cj-delvry.xyz/track" },
        ],
        choices: [
          { text: "링크를 클릭한다", emoji: "👆", safety: "danger", feedback: "위험! 정상 URL이 아닙니다. 'cj-delvry.xyz'는 가짜 도메인입니다.", isExit: false },
          { text: "CJ대한통운 공식 앱에서 직접 확인한다", emoji: "🛡️", safety: "safe", feedback: "정확합니다! 항상 공식 앱이나 웹사이트에서 직접 조회하세요.", isExit: true },
          { text: "일단 무시한다", emoji: "😐", safety: "caution", feedback: "무시하는 것도 방법이지만, 신고까지 하면 다른 피해를 막을 수 있습니다.", isExit: true },
        ],
        revealedRedFlags: ["비정상 URL (cj-delvry.xyz ≠ 공식 도메인)", "문자로 링크 클릭 유도"],
      },
      {
        messages: [
          { sender: "system", text: "🌐 링크를 클릭하자 택배 조회 페이지처럼 보이는 사이트가 열렸습니다" },
          { sender: "scammer", text: "배송 조회를 위해 본인인증 앱을 설치해 주세요. [다운로드]" },
        ],
        choices: [
          { text: "앱을 설치한다", emoji: "📱", safety: "danger", feedback: "큰 위험! 이 앱은 악성코드입니다. 개인정보와 금융정보가 모두 탈취됩니다.", isExit: false },
          { text: "뭔가 이상하다... 뒤로 간다", emoji: "🤔", safety: "caution", feedback: "다행히 눈치챘지만, 이미 가짜 사이트에 접속했습니다. 즉시 브라우저를 닫으세요.", isExit: true },
          { text: "이건 악성앱이다! 신고한다", emoji: "🛡️", safety: "safe", feedback: "정확합니다! 택배사는 절대 별도 앱 설치를 요구하지 않습니다.", isExit: true },
        ],
        revealedRedFlags: ["별도 앱 설치 요구 — 악성코드 유포 수법", "공식 앱스토어가 아닌 직접 다운로드"],
      },
      {
        messages: [
          { sender: "system", text: "⚠️ 악성 앱이 설치되었습니다. 백그라운드에서 개인정보 수집이 시작됩니다." },
          { sender: "system", text: "📋 수집 중: 연락처, 문자 메시지, 금융 앱 정보, 공인인증서..." },
          { sender: "scammer", text: "주소 확인이 완료되었습니다. 감사합니다." },
        ],
        choices: [
          { text: "다행이다, 택배가 오겠지", emoji: "😌", safety: "danger", feedback: "이미 악성앱이 모든 정보를 수집하고 있습니다. 즉시 118(인터넷진흥원)에 신고하세요!", isExit: true },
          { text: "이상하다... 앱을 삭제하고 신고한다", emoji: "🛡️", safety: "safe", feedback: "올바른 판단! 앱 삭제 후 118에 신고하고, 가능하면 핸드폰을 초기화하세요.", isExit: true },
        ],
        revealedRedFlags: ["악성앱으로 개인정보 전면 탈취", "탈취된 정보로 2차 금융사기 발생 가능"],
      },
    ],
    allRedFlags: [
      "비정상 URL (공식 도메인과 다름)",
      "문자 속 링크 클릭 유도",
      "별도 앱 설치 요구 (악성코드)",
      "공식 앱스토어가 아닌 직접 다운로드",
      "설치 후 과도한 권한 요구",
    ],
    preventionTips: [
      "택배 조회는 반드시 공식 앱(CJ대한통운, 우체국 등)에서 직접 확인",
      "문자 속 URL은 절대 클릭하지 마세요",
      "출처 불명의 앱은 절대 설치하지 마세요",
      "의심 문자는 118(인터넷진흥원)에 신고",
      "스마트폰 보안 설정에서 '출처를 알 수 없는 앱 설치' 차단",
    ],
    realCase: {
      title: "택배 문자 링크 클릭으로 3,800만원 피해",
      loss: "3,800만원",
      description: "택배 미수취 문자를 받고 링크를 클릭한 30대 직장인. 악성앱이 설치되어 공인인증서와 금융정보가 유출, 통장에서 3,800만원이 인출되었다.",
      source: "금융감독원 2025년 전자금융사기 사례",
      year: 2025,
    },
  },

  // ─── 3. 가족 사칭 메신저 ──────────────────────────
  {
    id: "family",
    title: "가족 사칭 메신저",
    subtitle: "자녀가 급하게 돈을 보내달라고?",
    type: "kakaotalk",
    difficulty: 1,
    icon: "👨‍👩‍👧",
    color: "#EC4899",
    bgColor: "#FDF2F8",
    callerInfo: "알 수 없는 번호",
    avgLoss: "평균 피해액 850만원",
    victimProfile: "50~70대 부모 세대 피해 집중",
    phases: [
      {
        messages: [
          { sender: "system", text: "💛 카카오톡 메시지가 도착했습니다 (모르는 번호)" },
          { sender: "scammer", text: "엄마 나 민수야" },
          { sender: "scammer", text: "폰 액정이 깨져서 수리 맡기고 친구 폰으로 연락해" },
          { sender: "scammer", text: "카톡도 안 돼서 이거로 보내는 거야" },
        ],
        choices: [
          { text: "민수야? 괜찮아?", emoji: "😟", safety: "caution", feedback: "먼저 걱정되는 마음은 이해하지만, 본인 확인이 먼저입니다.", isExit: false },
          { text: "민수 원래 번호로 직접 전화해본다", emoji: "🛡️", safety: "safe", feedback: "완벽합니다! 가족이라면 기존 번호로 직접 확인하는 게 가장 확실합니다.", isExit: true },
          { text: "무슨 일이야? 말해봐", emoji: "😰", safety: "danger", feedback: "신원 확인 없이 대화를 이어가면 사기에 빠지기 쉽습니다.", isExit: false },
        ],
        revealedRedFlags: ["모르는 번호에서 온 메시지", "'폰 고장' 핑계 — 직접 통화를 피하려는 수법"],
      },
      {
        messages: [
          { sender: "scammer", text: "엄마 급한 거 있어서 그러는데" },
          { sender: "scammer", text: "핸드폰 수리비 50만원 내야 하는데 지금 카드도 폰이랑 같이 맡겨서 결제가 안 돼" },
          { sender: "scammer", text: "국민은행 302-0000-1234-56 홍길동 으로 50만원만 보내줄 수 있어?" },
        ],
        choices: [
          { text: "알았어, 바로 보내줄게", emoji: "💸", safety: "danger", feedback: "위험! 예금주 이름이 자녀 이름과 다릅니다. 사기범의 계좌입니다.", isExit: true },
          { text: "예금주가 왜 다른 이름이야?", emoji: "🤔", safety: "caution", feedback: "좋은 관찰! 하지만 사기범은 '친구 계좌'라고 둘러댈 수 있습니다. 직접 전화로 확인하세요.", isExit: false },
          { text: "민수한테 직접 전화할게. 기다려", emoji: "🛡️", safety: "safe", feedback: "올바른 판단! 가족이 돈을 요구하면 반드시 직접 통화로 확인하세요.", isExit: true },
        ],
        revealedRedFlags: ["급한 돈 요구", "예금주가 자녀 이름이 아닌 타인 이름"],
      },
      {
        messages: [
          { sender: "scammer", text: "아 그건 친구 계좌야 내 계좌로 이체가 안 되니까" },
          { sender: "scammer", text: "엄마 제발 급해 빨리 보내줘 수리 안 하면 못 받아" },
          { sender: "scammer", text: "오늘 안에 안 보내면 위약금 나온대 ㅠㅠ" },
        ],
        choices: [
          { text: "알았어 알았어, 보내줄게", emoji: "💸", safety: "danger", feedback: "사기 피해가 발생합니다! 급하게 재촉하는 것 자체가 사기의 특징입니다.", isExit: true },
          { text: "그래도 직접 확인할게. 전화할 수 없으면 영상통화라도 해", emoji: "🛡️", safety: "safe", feedback: "완벽합니다! 영상통화를 요구하면 사기범은 대응할 수 없습니다.", isExit: true },
        ],
        revealedRedFlags: ["급박함을 조성하며 판단력 약화", "직접 통화/영상통화를 회피"],
      },
    ],
    allRedFlags: [
      "모르는 번호에서 가족을 사칭한 연락",
      "'폰 고장'으로 직접 통화를 피하는 핑계",
      "급한 돈 요구 (긴급성 조성)",
      "예금주가 가족 이름이 아닌 타인 이름",
      "직접 전화·영상통화를 회피",
    ],
    preventionTips: [
      "가족이 돈을 요구하면 반드시 기존 번호로 직접 전화하여 확인",
      "영상통화를 요청하면 사기범은 대응할 수 없습니다",
      "예금주 이름이 가족과 다르면 100% 사기입니다",
      "가족 간 '비밀번호'나 '확인 질문'을 미리 정해두세요",
      "의심되면 112에 신고하세요",
    ],
    realCase: {
      title: "아들 사칭 메신저 피싱으로 60대 어머니 2,000만원 피해",
      loss: "2,000만원",
      description: "아들을 사칭한 범인이 '폰 수리 중'이라며 카톡으로 접근. '급하게 돈이 필요하다'며 수차례에 걸쳐 2,000만원을 이체받았다. 어머니는 아들에게 직접 전화할 생각을 하지 못했다고.",
      source: "경찰청 사이버수사국 2025년 사례",
      year: 2025,
    },
  },

  // ─── 4. 은행 사칭 전화 ─────────────────────────────
  {
    id: "bank",
    title: "은행 사칭 전화",
    subtitle: "저금리 대환대출의 달콤한 유혹",
    type: "call",
    difficulty: 2,
    icon: "🏦",
    color: "#0EA5E9",
    bgColor: "#F0F9FF",
    callerInfo: "1588-XXXX (OO은행)",
    avgLoss: "평균 피해액 1,500만원",
    victimProfile: "30~50대 대출 수요자 피해 집중",
    phases: [
      {
        messages: [
          { sender: "system", text: "📞 1588-9999 (OO은행 고객센터)에서 전화가 왔습니다" },
          { sender: "scammer", text: "OO은행 대출상담팀입니다. 고객님, 현재 기존 대출을 저금리로 대환해 드리는 특별 프로모션을 진행 중입니다." },
          { sender: "scammer", text: "고객님의 신용등급이라면 연 2.5%로 갈아타실 수 있습니다. 관심 있으시겠습니까?" },
        ],
        choices: [
          { text: "네, 관심 있습니다!", emoji: "😊", safety: "caution", feedback: "은행이 먼저 전화해서 대출을 권유하는 경우 대부분 사기입니다.", isExit: false },
          { text: "직접 은행에 방문해서 확인하겠습니다", emoji: "🛡️", safety: "safe", feedback: "올바른 판단! 대출 관련 안내는 반드시 은행에 직접 방문하거나 공식 앱에서 확인하세요.", isExit: true },
          { text: "구체적으로 어떤 조건인가요?", emoji: "🤔", safety: "caution", feedback: "대화를 이어갈수록 사기범에게 개인정보를 노출할 위험이 높아집니다.", isExit: false },
        ],
        revealedRedFlags: ["은행이 먼저 전화로 대출을 권유 — 의심 신호"],
      },
      {
        messages: [
          { sender: "scammer", text: "대환대출 진행을 위해 기존 대출금을 먼저 상환하셔야 합니다." },
          { sender: "scammer", text: "상환 확인이 되면 즉시 저금리 대출이 실행됩니다." },
          { sender: "scammer", text: "상환금을 아래 계좌로 입금해 주시면 됩니다." },
        ],
        choices: [
          { text: "네, 상환할게요. 계좌번호 알려주세요", emoji: "💸", safety: "danger", feedback: "절대 안 됩니다! 정상적인 대환대출은 개인 계좌로 상환금을 보내라고 하지 않습니다.", isExit: true },
          { text: "왜 은행 계좌가 아닌 개인 계좌인가요?", emoji: "🤨", safety: "caution", feedback: "좋은 의심! 정상 대환대출은 은행 간 직접 처리됩니다.", isExit: true },
          { text: "수상합니다. 금감원에 확인하겠습니다", emoji: "🛡️", safety: "safe", feedback: "정확합니다! 금감원(1332)에서 해당 대출 상품이 실제 존재하는지 확인할 수 있습니다.", isExit: true },
        ],
        revealedRedFlags: ["기존 대출 '선 상환' 요구", "개인 계좌로 입금 유도 — 은행은 이렇게 하지 않음"],
      },
    ],
    allRedFlags: [
      "은행이 먼저 전화로 대출을 권유",
      "지나치게 좋은 조건 (초저금리)",
      "기존 대출 선상환 요구",
      "개인 계좌로 입금 유도",
      "수수료·공탁금 등 선입금 요구",
    ],
    preventionTips: [
      "은행은 절대 전화로 먼저 대출을 권유하지 않습니다",
      "대환대출 시 '선상환' 요구는 100% 사기입니다",
      "대출 상담은 반드시 은행 영업점에 직접 방문하여 확인",
      "금감원 1332에서 금융회사 등록 여부를 확인하세요",
      "수수료, 보증금, 공탁금 명목의 선입금 요구는 모두 사기",
    ],
    realCase: {
      title: "저금리 대환대출 사기로 40대 직장인 5,000만원 피해",
      loss: "5,000만원",
      description: "시중은행을 사칭한 범인이 '연 2% 초저금리 대환대출'을 제안. 기존 대출 상환을 위해 5,000만원을 개인 계좌로 이체시켰다. 이후 연락이 두절되었다.",
      source: "금융감독원 2025년 불법금융 피해 사례",
      year: 2025,
    },
  },

  // ─── 5. 투자 사기 메신저 ──────────────────────────
  {
    id: "investment",
    title: "투자 사기 메신저",
    subtitle: "단톡방의 수익률 300% 보장?",
    type: "kakaotalk",
    difficulty: 3,
    icon: "📈",
    color: "#10B981",
    bgColor: "#ECFDF5",
    callerInfo: "「VIP 투자클럽」 단톡방",
    avgLoss: "평균 피해액 4,700만원",
    victimProfile: "30~50대 재테크 관심 층",
    phases: [
      {
        messages: [
          { sender: "system", text: "💛 「VIP 투자클럽」 단톡방에 초대되었습니다 (멤버 237명)" },
          { sender: "scammer", text: "🔔 오늘의 추천종목: XX전자 / 목표 수익률 +35%" },
          { sender: "scammer", text: "「전문가」 김재훈: 어제 추천종목 +28% 달성했습니다! 인증 첨부 📊" },
          { sender: "scammer", text: "신규 회원 3명 남았습니다. 지금 등록하시면 무료 체험 가능!" },
        ],
        choices: [
          { text: "가입하고 싶습니다!", emoji: "🤩", safety: "danger", feedback: "투자 수익 보장은 법적으로 불가능합니다. 이런 단톡방은 99%가 사기입니다.", isExit: false },
          { text: "수익 인증이 조작은 아닌지 확인한다", emoji: "🤔", safety: "caution", feedback: "의심은 좋지만, 이들은 조작된 인증 자료를 대량으로 준비해둡니다.", isExit: false },
          { text: "투자 수익 보장은 불법 — 바로 나간다", emoji: "🛡️", safety: "safe", feedback: "정확합니다! 자본시장법상 수익률 보장은 불법입니다. 이런 단톡방은 즉시 나가세요.", isExit: true },
        ],
        revealedRedFlags: ["높은 수익률 보장 — 법적으로 불가능", "모르는 단톡방 초대", "가짜 수익 인증"],
      },
      {
        messages: [
          { sender: "scammer", text: "체험으로 소액 10만원만 투자해보세요. 3일 안에 30만원 돌려드립니다." },
          { sender: "scammer", text: "체험 수익금은 바로 인출 가능합니다. 위험 부담 제로!" },
        ],
        choices: [
          { text: "10만원이면 해볼 만하지", emoji: "💰", safety: "danger", feedback: "이것이 함정입니다! 소액 체험 후 실제 수익을 주어 신뢰를 쌓은 다음, 큰 금액을 투자하게 만듭니다.", isExit: false },
          { text: "공식 증권사 앱에서 확인한다", emoji: "🛡️", safety: "safe", feedback: "올바른 판단! 투자는 반드시 금감원에 등록된 공식 증권사를 통해서만 하세요.", isExit: true },
        ],
        revealedRedFlags: ["소액 체험으로 신뢰 구축 — '먹이주기' 수법", "'위험 부담 제로' 주장"],
      },
      {
        messages: [
          { sender: "system", text: "💰 체험 투자금 10만원 입금 완료" },
          { sender: "system", text: "📈 3일 후: 수익 30만원 발생! (인출 성공)" },
          { sender: "scammer", text: "축하합니다! 이번에는 본격적으로 500만원을 투자해보시겠어요?" },
          { sender: "scammer", text: "이번 주 특별 종목은 +200% 예상됩니다. 마감 임박!" },
        ],
        choices: [
          { text: "500만원 투자합니다!", emoji: "💸", safety: "danger", feedback: "전형적인 사기 패턴! 소액으로 실제 수익을 준 후 큰 금액을 투자하게 하고 잠적합니다.", isExit: true },
          { text: "이건 전형적인 사기 패턴이다. 신고한다", emoji: "🛡️", safety: "safe", feedback: "완벽한 판단! '먹이주기' 후 큰 돈을 빼앗는 전형적인 투자 사기 수법입니다.", isExit: true },
        ],
        revealedRedFlags: ["소액 수익 후 거액 투자 유도 — '먹이주기' 완성", "마감 임박으로 시간 압박"],
      },
    ],
    allRedFlags: [
      "투자 수익률 보장 — 법적으로 불가능",
      "모르는 단톡방 초대",
      "가짜 수익 인증 자료",
      "소액 체험 후 실제 수익 지급 ('먹이주기')",
      "점점 큰 금액 투자 유도",
      "마감 임박 등 시간 압박",
    ],
    preventionTips: [
      "투자 수익 보장은 자본시장법 위반 — 100% 사기입니다",
      "모르는 단톡방 초대는 즉시 나가세요",
      "소액 투자로 수익이 나도 절대 큰 돈을 투자하지 마세요",
      "투자는 금감원에 등록된 공식 증권사를 통해서만",
      "금감원 1332 또는 경찰 112에 신고하세요",
    ],
    realCase: {
      title: "주식 단톡방 사기로 50대 자영업자 1억 2천만원 피해",
      loss: "1억 2천만원",
      description: "투자 단톡방에서 '전문가 추천 종목'으로 처음에 200만원을 벌었다. 이후 점점 큰 금액을 투자하라는 권유에 1억 2천만원을 입금했지만, 출금이 차단되고 단톡방이 사라졌다.",
      source: "금융감독원 2025년 불법 유사수신 피해 사례",
      year: 2025,
    },
  },
];

// ─── Quiz Questions ──────────────────────────────────

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    type: "sms",
    content: "[국민건강보험] 건강검진 결과 확인: https://nhis-result.kr/view",
    sender: "1577-1000",
    isPhishing: true,
    explanation: "건강보험공단 공식 도메인은 nhis.or.kr입니다. 'nhis-result.kr'은 가짜 도메인입니다.",
    redFlags: ["비정상 도메인", "링크 클릭 유도"],
  },
  {
    id: "q2",
    type: "sms",
    content: "[카카오] 카카오계정 비밀번호 변경이 감지되었습니다. 본인이 아닌 경우 고객센터(1577-3754)로 문의하세요.",
    sender: "카카오",
    isPhishing: false,
    explanation: "정상 알림입니다. 링크가 없고, 공식 고객센터 번호만 안내합니다.",
  },
  {
    id: "q3",
    type: "call",
    content: "여보세요, 금융감독원 조사관입니다. 고객님 명의 계좌가 자금세탁에 이용된 정황이 있어 안전조치가 필요합니다.",
    sender: "02-3145-XXXX",
    isPhishing: true,
    explanation: "금융감독원은 절대 전화로 계좌 조사를 하지 않습니다. '안전조치'라는 말은 사기범의 전형적 표현입니다.",
    redFlags: ["기관 사칭", "계좌 안전조치 언급"],
  },
  {
    id: "q4",
    type: "message",
    content: "엄마 나 지연이야. 폰을 잃어버려서 새 번호로 연락해. 급하게 문화상품권 5만원짜리 3장만 사서 핀번호 보내줘.",
    sender: "010-XXXX-XXXX",
    isPhishing: true,
    explanation: "가족 사칭 사기입니다. '문화상품권 핀번호'를 요구하는 것은 추적이 어려운 사기 수법입니다.",
    redFlags: ["가족 사칭", "상품권 핀번호 요구"],
  },
  {
    id: "q5",
    type: "sms",
    content: "[OO카드] 5월 이용대금 명세서가 발송되었습니다. 앱에서 확인하세요.",
    sender: "OO카드",
    isPhishing: false,
    explanation: "정상 알림입니다. 별도 링크 없이 앱 확인을 안내합니다.",
  },
  {
    id: "q6",
    type: "link",
    content: "https://kbstar.com.login-verify.xyz/auth",
    sender: "문자 속 링크",
    isPhishing: true,
    explanation: "'kbstar.com'처럼 보이지만 실제 도메인은 'login-verify.xyz'입니다. 서브도메인으로 위장한 가짜 URL입니다.",
    redFlags: ["도메인 위장", "xyz 비정상 도메인"],
  },
  {
    id: "q7",
    type: "call",
    content: "안녕하세요, OO구청입니다. 재난지원금 추가 지급 대상이십니다. 본인 확인을 위해 주민등록번호와 계좌번호를 알려주세요.",
    sender: "02-XXXX-XXXX",
    isPhishing: true,
    explanation: "정부기관은 전화로 주민등록번호나 계좌번호를 요구하지 않습니다. 재난지원금은 공식 사이트에서만 신청합니다.",
    redFlags: ["기관 사칭", "개인정보 요구"],
  },
  {
    id: "q8",
    type: "sms",
    content: "[우체국택배] 등기우편 도착. 내일까지 수령하지 않으면 반송됩니다. 수령일 변경: 1588-1300",
    sender: "우체국",
    isPhishing: false,
    explanation: "정상 알림입니다. 공식 번호(1588-1300)만 안내하고 별도 링크가 없습니다.",
  },
  {
    id: "q9",
    type: "message",
    content: "「고수익 재테크」 단톡방 초대! 전문 애널리스트의 무료 종목 추천. 월 수익률 50% 이상 보장합니다.",
    sender: "단톡방 초대",
    isPhishing: true,
    explanation: "수익률 보장은 자본시장법 위반이며 100% 사기입니다. 이런 단톡방은 즉시 나가세요.",
    redFlags: ["수익 보장", "단톡방 초대"],
  },
  {
    id: "q10",
    type: "sms",
    content: "[삼성전자] 갤럭시 S25 당첨! 배송비 3,000원 결제 후 수령 가능: http://samsung-event.co.kr/prize",
    sender: "010-XXXX-XXXX",
    isPhishing: true,
    explanation: "경품 당첨 후 결제를 요구하는 것은 사기입니다. 삼성 공식 도메인은 samsung.com입니다.",
    redFlags: ["경품 사기", "소액 결제 유도", "비정상 도메인"],
  },
];

// ─── Statistics Data ─────────────────────────────────

export const YEARLY_STATS: YearlyStats[] = [
  { year: 2019, cases: 37667, totalLoss: 6398, avgLoss: 1699 },
  { year: 2020, cases: 31681, totalLoss: 7000, avgLoss: 2210 },
  { year: 2021, cases: 30982, totalLoss: 7744, avgLoss: 2500 },
  { year: 2022, cases: 21832, totalLoss: 5438, avgLoss: 2491 },
  { year: 2023, cases: 18902, totalLoss: 4472, avgLoss: 2366 },
  { year: 2024, cases: 22473, totalLoss: 8545, avgLoss: 3803 },
  { year: 2025, cases: 26100, totalLoss: 10200, avgLoss: 3908 },
];

export const SCAM_TYPE_STATS: ScamTypeStats[] = [
  { type: "기관 사칭 (검찰·경찰)", percentage: 34, color: "#6366F1" },
  { type: "대출 사기", percentage: 26, color: "#0EA5E9" },
  { type: "가족·지인 사칭", percentage: 18, color: "#EC4899" },
  { type: "투자 사기", percentage: 12, color: "#10B981" },
  { type: "택배·쇼핑 사칭", percentage: 7, color: "#F59E0B" },
  { type: "기타", percentage: 3, color: "#94A3B8" },
];

export const KEY_STATS = {
  dailyVictims: 71,
  yearlyLoss: "1조 200억",
  avgLossPerCase: "3,908만",
  yearlyIncrease: "+19.2%",
  unreportedRate: "약 60%",
  recoveryRate: "약 7%",
};
