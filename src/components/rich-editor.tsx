"use client";

import { useEffect, useRef, useState } from "react";
import { blocksToHtml, domToBlocks } from "@/lib/blocks";
import type { Block } from "@/lib/memos";
import { FormatButton } from "./format-button";

type Active = { bold: boolean; heading: boolean; subheading: boolean; list: boolean };
const none: Active = { bold: false, heading: false, subheading: false, list: false };

/**
 * Editor — 서식 막대(Editor/Toolbar) + 구분선 + 본문.
 * 본문은 contenteditable 이고, 글이 바뀔 때마다 블록(대제목·소제목·문단·목록)으로 바꿔 onChange 로 알린다.
 */
export function RichEditor({
  initialBlocks,
  onChange,
}: {
  initialBlocks: Block[];
  onChange: (blocks: Block[]) => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  // 처음 한 번만 정한다: 이후에는 브라우저가 DOM 을 직접 고친다
  const [initialHtml] = useState(() => blocksToHtml(initialBlocks));
  const [empty, setEmpty] = useState(() => initialBlocks.length === 0);
  const [active, setActive] = useState<Active>(none);

  const sync = () => {
    const body = bodyRef.current;
    if (!body) return;
    const blocks = domToBlocks(body);
    setEmpty(blocks.length === 0);
    onChange(blocks);
  };

  // 커서가 있는 글자의 서식을 서식 막대에 보여 준다
  useEffect(() => {
    const update = () => {
      const body = bodyRef.current;
      const selection = window.getSelection();
      if (!body || !selection || !selection.anchorNode || !body.contains(selection.anchorNode)) {
        setActive(none);
        return;
      }
      let block: Node | null = selection.anchorNode;
      while (block && block.parentNode !== body) block = block.parentNode;
      const tag = block instanceof HTMLElement ? block.tagName : "";
      setActive({
        bold: document.queryCommandState("bold"),
        heading: tag === "H2",
        subheading: tag === "H3",
        list: tag === "UL",
      });
    };
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);

  const run = (command: string, value?: string) => {
    const body = bodyRef.current;
    if (!body) return;
    body.focus();
    document.execCommand(command, false, value);
    sync();
  };

  /** 같은 서식을 다시 누르면 보통 문단으로 되돌린다 */
  const toggleBlock = (tag: "h2" | "h3", isActive: boolean) => run("formatBlock", isActive ? "p" : tag);

  return (
    <div className="overflow-clip rounded-lg border-2 border-surface-card bg-surface-card focus-within:border-primary">
      <div role="toolbar" aria-label="서식" className="flex h-13 items-center gap-space-4 px-space-12">
        <FormatButton active={active.bold} onClick={() => run("bold")}>
          B
        </FormatButton>
        <FormatButton active={active.heading} onClick={() => toggleBlock("h2", active.heading)}>
          제목
        </FormatButton>
        <FormatButton active={active.subheading} onClick={() => toggleBlock("h3", active.subheading)}>
          소제목
        </FormatButton>
        <FormatButton active={active.list} onClick={() => run("insertUnorderedList")}>
          목록
        </FormatButton>
      </div>
      <hr className="h-px border-0 bg-border-default" />
      <div className="relative">
        {empty && (
          <span
            aria-hidden
            className="pointer-events-none absolute top-space-16 left-space-20 text-body-md text-text-muted"
          >
            내용을 입력하세요
          </span>
        )}
        <div
          ref={bodyRef}
          role="textbox"
          aria-label="본문"
          aria-multiline="true"
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          className="rich-body min-h-32 px-space-20 py-space-16 outline-none"
          dangerouslySetInnerHTML={{ __html: initialHtml }}
          onFocus={() => document.execCommand("defaultParagraphSeparator", false, "p")}
          onInput={sync}
          // 붙여 넣은 글의 서식·스타일은 가져오지 않고 글자만 넣는다
          onPaste={(event) => {
            event.preventDefault();
            document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
          }}
        />
      </div>
    </div>
  );
}
