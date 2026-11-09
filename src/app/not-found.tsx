import Link from "next/link";
export default function NotFound() {
  return <section className="container page-content"><div className="empty-state"><span className="eyebrow">404 · WRONG TURN</span><h1>That page isn't on the menu.</h1><p>Let's get you back to something delicious.</p><Link className="button button-primary" href="/">Back to home</Link></div></section>;
}
