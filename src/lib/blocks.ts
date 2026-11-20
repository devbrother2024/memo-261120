import type { Block, TextPart } from "./memos";

/* ───────── 블록 → 에디터 HTML (글자는 모두 이스케이프) ───────── */

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const partsToHtml = (parts: TextPart[]) =>
  parts
    .map((part) => {
      const html = escapeHtml(part.text).replace(/\n/g, "<br>");
      return part.bold ? `<b>${html}</b>` : html;
    })
    .join("");

export function blocksToHtml(blocks: Block[]): string {
  if (blocks.length === 0) return "<p><br></p>";
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `<h2>${escapeHtml(block.text)}</h2>`;
        case "subheading":
          return `<h3>${escapeHtml(block.text)}</h3>`;
        case "paragraph":
          return `<p>${partsToHtml(block.parts)}</p>`;
        case "list":
          return `<ul>${block.items.map((item) => `<li>${partsToHtml(item)}</li>`).join("")}</ul>`;
      }
    })
    .join("");
}

/* ───────── 에디터 DOM → 블록 ───────── */

/** 같은 굵기끼리 합치고, 앞뒤 공백·빈 덩어리를 정리한다 */
function tidy(parts: TextPart[]): TextPart[] {
  const merged: TextPart[] = [];
  for (const part of parts) {
    const text = part.text.replace(/ /g, " ");
    if (!text) continue;
    const last = merged[merged.length - 1];
    if (last && !!last.bold === !!part.bold) last.text += text;
    else merged.push({ text, ...(part.bold ? { bold: true } : {}) });
  }
  if (merged.length) {
    merged[0].text = merged[0].text.replace(/^\s+/, "");
    merged[merged.length - 1].text = merged[merged.length - 1].text.replace(/\s+$/, "");
  }
  return merged.filter((part) => part.text);
}

function isBoldElement(el: HTMLElement): boolean {
  if (el.tagName === "B" || el.tagName === "STRONG") return true;
  const weight = el.style.fontWeight;
  return weight === "bold" || (weight !== "" && Number(weight) >= 600);
}

function inlineParts(node: Node, bold: boolean): TextPart[] {
  if (node.nodeType === Node.TEXT_NODE) return [{ text: node.textContent ?? "", bold }];
  if (!(node instanceof HTMLElement)) return [];
  if (node.tagName === "BR") return [{ text: "\n", bold }];
  const nextBold = bold || isBoldElement(node);
  return Array.from(node.childNodes).flatMap((child) => inlineParts(child, nextBold));
}

const BLOCK_TAGS = new Set(["P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "UL", "OL", "LI"]);
const isBlockElement = (node: Node): node is HTMLElement => node instanceof HTMLElement && BLOCK_TAGS.has(node.tagName);

export function domToBlocks(root: HTMLElement): Block[] {
  const blocks: Block[] = [];
  let loose: TextPart[] = [];

  const flushLoose = () => {
    const parts = tidy(loose);
    if (parts.length) blocks.push({ type: "paragraph", parts });
    loose = [];
  };

  const walk = (container: Node) => {
    for (const node of Array.from(container.childNodes)) {
      if (!isBlockElement(node)) {
        loose.push(...inlineParts(node, false));
        continue;
      }
      flushLoose();
      const tag = node.tagName;
      if (tag === "H1" || tag === "H2") {
        const text = tidy(inlineParts(node, false)).map((part) => part.text).join("");
        if (text) blocks.push({ type: "heading", text });
      } else if (/^H[3-6]$/.test(tag)) {
        const text = tidy(inlineParts(node, false)).map((part) => part.text).join("");
        if (text) blocks.push({ type: "subheading", text });
      } else if (tag === "UL" || tag === "OL") {
        const items = Array.from(node.children)
          .map((li) => tidy(inlineParts(li, false)))
          .filter((parts) => parts.length > 0);
        if (items.length) blocks.push({ type: "list", items });
      } else if (Array.from(node.childNodes).some(isBlockElement)) {
        walk(node); // 안쪽에 블록이 또 있는 DIV
      } else {
        const parts = tidy(inlineParts(node, false));
        if (parts.length) blocks.push({ type: "paragraph", parts });
      }
    }
    flushLoose();
  };

  walk(root);
  return blocks;
}

/* ───────── 목록 미리보기 ───────── */

export function blocksPreview(blocks: Block[]): string {
  for (const block of blocks) {
    const text =
      block.type === "paragraph"
        ? block.parts.map((part) => part.text).join("")
        : block.type === "list"
          ? (block.items[0] ?? []).map((part) => part.text).join("")
          : block.text;
    const line = text.replace(/\s+/g, " ").trim();
    if (line) return line.length > 80 ? `${line.slice(0, 80)}…` : line;
  }
  return "";
}
