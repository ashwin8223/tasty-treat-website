import Link from "next/link";
export default function LoginPage() {
  return (
    <section className="auth-wrap">
      <div className="auth-card">
        <span className="eyebrow">WELCOME BACK</span>
        <h1>
          Good to see you<span className="accent">.</span>
        </h1>
        <p>Sign in to make your next order a little easier.</p>
        <form action="#">
          <label>
            Email address
            <input type="email" required placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" required placeholder="Your password" />
          </label>
          <button className="button button-primary button-wide" type="submit">
            Sign in
          </button>
        </form>
        <div className="auth-foot">
          New to Tasty Treat? <Link href="/menu">Explore our menu</Link>
        </div>
        <p className="form-note">
          UI placeholder — connect Auth.js or your chosen authentication
          provider.
        </p>
      </div>
    </section>
  );
}
