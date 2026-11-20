import { Icon } from "./icon";

/** Card/Container — 흰 카드 바탕. 안에 CardHeader 와 MemoItem 을 넣는다 */
export function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section aria-label={label} className="flex flex-col overflow-clip rounded-xl bg-surface-card py-space-8">
      {children}
    </section>
  );
}

/** Card/Header — pin 을 켜면 고정 표시, action 을 켜면 오른쪽에 전체 보기 */
export function CardHeader({
  title,
  pin = false,
  action = false,
}: {
  title: string;
  pin?: boolean;
  action?: boolean;
}) {
  return (
    <div className="flex h-10 items-center gap-space-4 pt-space-12 pr-space-16 pb-space-4 pl-space-20">
      {pin && <Icon name="pin-16" className="text-label-blue" />}
      <h2 className="min-w-0 flex-1 text-label-md text-text-primary">{title}</h2>
      {action && (
        <button
          type="button"
          className="inline-flex items-center gap-space-4 text-caption-md whitespace-nowrap text-text-muted active:opacity-70"
        >
          전체 보기
          <Icon name="chevron-right" />
        </button>
      )}
    </div>
  );
}
