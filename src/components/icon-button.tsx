import Link from "next/link";
import { Icon, type IconName } from "./icon";

const className =
  "flex size-10 items-center justify-center rounded-sm text-text-primary active:opacity-70 focus-visible:outline-2 focus-visible:outline-primary";

/** Button/Icon — 40×40 누르는 영역 가운데에 아이콘. href 가 있으면 링크로 이동한다 */
export function IconButton({
  icon,
  label,
  href,
}: {
  icon: IconName;
  /** 화면 낭독용 이름 */
  label: string;
  href?: string;
}) {
  if (href) {
    return (
      <Link href={href} aria-label={label} className={className}>
        <Icon name={icon} />
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} className={className}>
      <Icon name={icon} />
    </button>
  );
}
