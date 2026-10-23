import Image from "next/image";
import Link from "next/link";

export function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" className="brand" aria-label="SANMEDIA home" onClick={onClick}>
      <Image src="/images/sanmedia-mark-white.png" alt="" width={36} height={36} unoptimized />
      <span className="display">
        SANMEDIA
        <span className="brand-dot" aria-hidden="true">
          •
        </span>
      </span>
    </Link>
  );
}
