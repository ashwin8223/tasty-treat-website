import Link from "next/link";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-line bg-[radial-gradient(circle_at_82%_20%,rgba(232,117,50,0.12),transparent_28%),var(--surface)] pt-25 pb-15 max-[700px]:pt-17.5 max-[700px]:pb-11.25">
      <div className="mx-auto w-[min(1160px,calc(100%-48px))] max-[700px]:w-[min(calc(100%-32px),560px)]">
        <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
          {eyebrow}
        </span>
        <h1 className="my-3.75 max-w-190 text-[clamp(48px,7vw,78px)] leading-none tracking-[-0.07em]">
          {title}
        </h1>
        <p className="m-0 max-w-145 text-[14px] leading-[1.8] text-muted">
          {description}
        </p>
        <div className="mt-8.75 flex gap-2.5 text-[10px] text-[#7d837b]">
          <Link href="/" className="text-accent">
            Home
          </Link>
          <span>/</span>
          <span>{title}</span>
        </div>
      </div>
    </section>
  );
}
