import { categories, labelColors, type Block, type Category, type LabelColor, type TextPart } from "./memos";

/* ───────── 바깥에서 들어온 값 검사 (손으로 고친 값이 들어 있어도 안전하게) ───────── */

const isPart = (x: unknown): x is TextPart =>
  typeof x === "object" && x !== null && typeof (x as TextPart).text === "string";

const isBlock = (x: unknown): x is Block => {
  if (typeof x !== "object" || x === null) return false;
  const b = x as Record<string, unknown>;
  switch (b.type) {
    case "heading":
    case "subheading":
      return typeof b.text === "string";
    case "paragraph":
      return Array.isArray(b.parts) && b.parts.every(isPart);
    case "list":
      return Array.isArray(b.items) && b.items.every((item) => Array.isArray(item) && item.every(isPart));
    default:
      return false;
  }
};

export const toBlocks = (x: unknown): Block[] => (Array.isArray(x) ? x.filter(isBlock) : []);
export const toCategory = (x: unknown): Category => (categories.includes(x as Category) ? (x as Category) : "개인");
export const toColor = (x: unknown): LabelColor => (labelColors.includes(x as LabelColor) ? (x as LabelColor) : "green");

export const isCategory = (x: unknown): x is Category => categories.includes(x as Category);
export const isLabelColor = (x: unknown): x is LabelColor => labelColors.includes(x as LabelColor);
