export type LabelColor = "blue" | "green" | "orange" | "pink";
export type Category = "업무" | "개인" | "아이디어";

export const categories: Category[] = ["업무", "개인", "아이디어"];
export const labelColors: LabelColor[] = ["blue", "green", "orange", "pink"];

export type TextPart = { text: string; bold?: boolean };

export type Block =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; parts: TextPart[] }
  | { type: "list"; items: TextPart[][] };

export type Memo = {
  id: string;
  title: string;
  preview: string;
  /** 홈 목록에 보이는 날짜 */
  listDate: string;
  /** 상세 화면 배지 옆 날짜 */
  detailDate: string;
  category: Category;
  /** 메모의 색 라벨 */
  color: LabelColor;
  pinned: boolean;
  blocks: Block[];
};

/** 굵지 않은 글자 한 덩어리 */
const plain = (text: string): TextPart[] => [{ text }];

export const memos: Memo[] = [
  {
    id: "design-review",
    title: "디자인 리뷰 회의록",
    preview: "검수 기준과 다음 할 일 정리",
    listDate: "오늘",
    detailDate: "10월 30일 오전 9:12",
    category: "업무",
    color: "blue",
    pinned: true,
    blocks: [
      { type: "heading", text: "회의 요약" },
      {
        type: "paragraph",
        parts: [
          { text: "이번 주 디자인 리뷰에서 홈과 상세 화면의 검수 기준을 맞췄다. 핵심은 " },
          { text: "개발자가 AI로 구현해도 시안이 깨지지 않게", bold: true },
          { text: " 만드는 것이다." },
        ],
      },
      { type: "subheading", text: "결정한 것" },
      {
        type: "list",
        items: ["묶음은 오토레이아웃으로", "색과 간격은 변수로 연결", "반복되는 UI는 컴포넌트로"].map(plain),
      },
      { type: "subheading", text: "다음 할 일" },
      {
        type: "paragraph",
        parts: [
          { text: "금요일까지", bold: true },
          { text: " 각자 맡은 화면을 직접 채점해 온다. 점수보다 깎인 이유를 먼저 본다." },
        ],
      },
      { type: "subheading", text: "남은 질문" },
      {
        type: "paragraph",
        parts: [{ text: "다크 모드 색은 누가 정할지, 아이콘은 직접 그릴지 다음 회의에서 정한다." }],
      },
    ],
  },
  {
    id: "weekend-hike",
    title: "주말 등산 준비",
    preview: "물 두 병, 간식, 바람막이 챙기기",
    listDate: "어제",
    detailDate: "10월 29일 오후 6:40",
    category: "개인",
    color: "green",
    pinned: true,
    blocks: [
      { type: "heading", text: "준비물" },
      { type: "list", items: ["물 두 병", "간식", "바람막이"].map(plain) },
      { type: "subheading", text: "일정" },
      {
        type: "paragraph",
        parts: [
          { text: "토요일 " },
          { text: "아침 7시", bold: true },
          { text: "에 출발한다. 정상에서 점심을 먹고 오후 3시 전에 내려온다." },
        ],
      },
    ],
  },
  {
    id: "grocery-list",
    title: "장보기 목록",
    preview: "우유, 계란, 사과, 커피 원두",
    listDate: "오늘",
    detailDate: "10월 30일 오전 8:05",
    category: "개인",
    color: "pink",
    pinned: false,
    blocks: [
      { type: "heading", text: "살 것" },
      { type: "list", items: ["우유", "계란", "사과", "커피 원두"].map(plain) },
      {
        type: "paragraph",
        parts: [{ text: "퇴근길에 집 앞 마트에 들러서 한 번에 산다." }],
      },
    ],
  },
  {
    id: "app-icon-idea",
    title: "앱 아이콘 아이디어",
    preview: "메모지 모서리가 접힌 모양",
    listDate: "오늘",
    detailDate: "10월 30일 오전 7:30",
    category: "아이디어",
    color: "orange",
    pinned: false,
    blocks: [
      { type: "heading", text: "아이디어" },
      {
        type: "paragraph",
        parts: [
          { text: "메모지 " },
          { text: "모서리가 접힌 모양", bold: true },
          { text: "을 아이콘으로 쓴다." },
        ],
      },
      { type: "subheading", text: "확인할 것" },
      {
        type: "list",
        items: ["작게 줄여도 알아볼 수 있는지", "다크 모드에서도 잘 보이는지"].map(plain),
      },
    ],
  },
  {
    id: "reading-list",
    title: "읽을 책",
    preview: "디자인 시스템 책 두 권",
    listDate: "어제",
    detailDate: "10월 29일 오후 1:15",
    category: "개인",
    color: "green",
    pinned: false,
    blocks: [
      { type: "heading", text: "목록" },
      { type: "list", items: ["디자인 시스템 책", "한글 타이포그래피 책"].map(plain) },
      {
        type: "paragraph",
        parts: [{ text: "이번 달 안에 한 권씩 읽고 메모로 남긴다." }],
      },
    ],
  },
];

export function findMemo(id: string): Memo | undefined {
  return memos.find((memo) => memo.id === id);
}
