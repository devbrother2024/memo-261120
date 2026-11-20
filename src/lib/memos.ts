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
