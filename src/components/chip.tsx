/** Chip — 분류 칩. 고른 칩은 selected */
export function Chip({
  selected = false,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex h-9 items-center rounded-full px-space-16 text-label-md whitespace-nowrap active:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        selected ? "bg-primary text-text-on-primary" : "bg-surface-card text-text-secondary"
      }`}
    >
      {children}
    </button>
  );
}
