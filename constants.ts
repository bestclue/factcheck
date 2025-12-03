import { ScriptSegment } from './types';

// The full script provided in the prompt, broken down into segments for the interactive player
// Duration is increased to allow for reading subtitles comfortably
export const LEARNING_SCRIPT: ScriptSegment[] = [
  {
    id: 1,
    section: 'intro',
    visualType: 'scene',
    narration: "오늘 안에 트렌드 조사 기반 제안서 초안을 제출해야 합니다. 하지만… 이미 일정은 꽉 찼고, 시간은 1시간도 남지 않았죠.",
    visualText: "D-Day: 제안서 제출 마감",
    subText: "남은 시간: 00:58:00",
    duration: 8
  },
  {
    id: 2,
    section: 'intro',
    visualType: 'ui-chat',
    narration: "그래서 ‘일단 AI에게 맡겨보자’고 생각합니다. 2024년 소비자 트렌드 조사를 요청했습니다.",
    visualText: "생성형 AI에게 질문 중...",
    subText: "프롬프트: 2024 소비자 트렌드와 시장 규모 알려줘",
    duration: 6
  },
  {
    id: 3,
    section: 'intro',
    visualType: 'ui-chat',
    narration: "2024년 소비자 트렌드 1위는 하이퍼 퍼스널라이제이션이며, 시장 성장률은 27%입니다. 한국디지털리서치센터 2023년 보고서에 따르면...",
    visualText: "AI 답변 생성 완료",
    subText: "1. 하이퍼 퍼스널라이제이션 (성장률 27%)\n출처: 한국디지털리서치센터(2023)",
    duration: 10
  },
  {
    id: 4,
    section: 'intro',
    visualType: 'quiz',
    narration: "겉보기엔 아주 그럴듯한 문장들입니다. 그런데… 여기서 뭔가 이상하지 않나요? 이 문장 중 ‘환각일 가능성이 가장 높은’ 부분은 무엇일까요?",
    visualText: "미니 퀴즈: 어디가 틀렸을까요?",
    subText: "잠시 멈추고 생각해보세요.",
    duration: 8
  },
  {
    id: 5,
    section: 'development',
    visualType: 'comparison',
    narration: "문제는 AI가 ‘실제 트렌드 보고서’를 검색해 가져오는 게 아니라 그냥 그럴싸한 숫자를 ‘만들어낸다’는 점입니다.",
    visualText: "AI의 작동 원리",
    subText: "검색(Search)이 아닌 생성(Generation)",
    duration: 8
  },
  {
    id: 6,
    section: 'development',
    visualType: 'comparison',
    narration: "이 숫자, 근거가 없습니다. 완전히 AI가 만든 창작 수치입니다. 실제 시장 성장률은 12%인데, AI는 27%라고 말했죠.",
    visualText: "팩트 체크: 숫자 오류",
    subText: "실제: 12% vs AI 예측: 27%",
    highlight: "27%",
    duration: 10
  },
  {
    id: 7,
    section: 'development',
    visualType: 'scene',
    narration: "이번엔 출처입니다. 알 수 없는 기관 이름, 존재하지 않는 보고서. AI는 이런 출처를 자주 만들어냅니다. 만약 이대로 제출했다면, 팩트체크 지적을 피할 수 없습니다.",
    visualText: "출처 오류: 한국디지털리서치센터",
    subText: "404 Not Found: 존재하지 않는 기관",
    duration: 12
  },
  {
    id: 8,
    section: 'summary',
    visualType: 'summary',
    narration: "오늘의 핵심 요약입니다. 첫째, 숫자는 반드시 검증하세요. 둘째, 출처는 반드시 검색해보세요. 셋째, AI는 사실을 조회하는 것이 아니라 패턴을 생성할 뿐입니다.",
    visualText: "핵심 요약 3가지",
    subText: "1. 숫자 검증\n2. 출처 검색\n3. AI는 패턴 생성기",
    duration: 12
  }
];

export const SLACK_PROMO_TEXT = "🔥 오늘의 초mini 챌린지!\nAI가 만든 문장에서 ‘수상한 숫자’ 하나 골라 댓글로 남겨주세요.\n선착순 10명 ‘환각사냥꾼’ 배지 지급 🎖\n(직장인은 다 아는 그 느낌… 숫자 꼭 다시 봐야 합니다 😇)";