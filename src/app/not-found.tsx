import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto min-h-[65vh] w-[min(1160px,calc(100%-48px))] pt-18.75 pb-25 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:pt-13.75 max-[700px]:pb-17.5">
      <div className="flex min-h-72.5 flex-col items-center justify-center rounded-xl border border-dashed border-line px-5 py-10 text-center">
        <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
          404 · WRONG TURN
        </span>
        <h1 className="my-2.5 text-[24px] tracking-[-0.04em]">
          That page isn&apos;t on the menu.
        </h1>
        <p className="mb-5 max-w-115 text-[12px] leading-[1.8] text-muted">
          Let&apos;s get you back to something delicious.
        </p>
        <Link
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-transparent bg-accent px-5.25 text-[13px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover"
          href="/"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
