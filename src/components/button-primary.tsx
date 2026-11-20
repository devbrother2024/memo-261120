import Link from "next/link";
import { Icon } from "./icon";

const className =
  "flex h-14 w-full items-center justify-center gap-space-8 rounded-md bg-primary px-space-24 text-button-md text-text-on-primary active:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/**
 * Button/Primary — 화면의 주 버튼. 화면마다 하나만, 아래쪽에 가로로 꽉 차게. icon 을 켜면 앞에 +
 * href 가 있으면 그 화면으로 이동하는 링크, 없으면 버튼
 */
export function ButtonPrimary({
  label,
  icon = false,
  href,
  onClick,
}: {
  label: string;
  icon?: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      {icon && <Icon name="plus" />}
      {label}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
