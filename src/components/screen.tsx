/** 모바일 화면 바탕: 390 폭 기준, 세로로 쌓고 마지막 요소(주 버튼)는 아래에 붙는다 */
export function Screen({
  className = "",
  children,
}: {
  /** 화면마다 다른 위쪽 여백 (pt-space-*) */
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-space-16 bg-surface-page px-space-16 pb-space-34 ${className}`}
    >
      {children}
    </div>
  );
}
