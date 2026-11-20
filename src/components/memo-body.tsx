import type { Block, TextPart } from "@/lib/memos";

/** 굵은 글씨가 섞인 한 줄: 굵은 부분은 body/md-bold + text/primary */
function Parts({ parts }: { parts: TextPart[] }) {
  return parts.map((part, i) =>
    part.bold ? (
      <strong key={i} className="text-body-md-bold text-text-primary">
        {part.text}
      </strong>
    ) : (
      <span key={i}>{part.text}</span>
    ),
  );
}

/** 메모 본문: 대제목, 소제목, 문단(굵은 글씨 포함), 목록 */
export function MemoBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-space-12">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={index} className="text-title-lg text-text-primary">
                {block.text}
              </h2>
            );
          case "subheading":
            return (
              <h3 key={index} className="text-title-md text-text-primary">
                {block.text}
              </h3>
            );
          case "paragraph":
            return (
              <p key={index} className="text-body-md whitespace-pre-line text-text-secondary">
                <Parts parts={block.parts} />
              </p>
            );
          case "list":
            return (
              <ul key={index} className="flex flex-col gap-space-4">
                {block.items.map((item, i) => (
                  <li key={i} className="flex gap-space-8 text-body-md text-text-secondary">
                    <span aria-hidden>•</span>
                    <span className="min-w-0 flex-1">
                      <Parts parts={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}
