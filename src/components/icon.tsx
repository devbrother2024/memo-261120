import type { CSSProperties } from "react";

/**
 * Figma 아이콘(Icon/*)의 SVG 파일을 그대로 쓰되, 마스크로 칠해서 색이 글자색(currentColor)을 따른다.
 * 색은 부모(또는 이 요소)의 text-* 토큰 클래스로 정한다.
 * 파일: public/icons/{name}.svg
 */
const sizes = {
  plus: "size-5", // 20
  note: "size-5.5", // 22
  "pin-16": "size-4", // 16
  "pin-24": "size-6", // 24
  "chevron-left": "size-6",
  "chevron-right": "size-4",
  more: "size-6",
  share: "size-6",
} as const;

export type IconName = keyof typeof sizes;

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const url = `url(/icons/${name}.svg)`;
  const style: CSSProperties = {
    maskImage: url,
    WebkitMaskImage: url,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
  };
  return <span aria-hidden className={`block shrink-0 bg-current ${sizes[name]} ${className}`} style={style} />;
}
