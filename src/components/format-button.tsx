/** Button/Format — 서식 버튼. 커서가 있는 글자의 서식은 active 로 보인다 */
export function FormatButton({
  active = false,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      // 누르는 순간 에디터의 선택(커서)이 풀리지 않게 한다
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`flex h-9 items-center justify-center rounded-sm px-space-12 text-label-md whitespace-nowrap active:opacity-70 ${
        active ? "bg-label-blue-soft text-primary" : "text-text-secondary"
      }`}
    >
      {children}
    </button>
  );
}
