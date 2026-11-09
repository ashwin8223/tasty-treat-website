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
    <section className="page-hero">
      <div className="container">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{title}</span>
        </div>
      </div>
    </section>
  );
}
