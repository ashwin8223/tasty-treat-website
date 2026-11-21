export function SectionTitle({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "text-center" : undefined}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 mb-2.5 text-[clamp(34px,4vw,52px)] leading-[1.06] tracking-[-0.06em]">
        {title}
      </h2>
      {description && (
        <p
          className={`m-0 max-w-135 text-[14px] leading-[1.8] text-muted ${
            centered ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
