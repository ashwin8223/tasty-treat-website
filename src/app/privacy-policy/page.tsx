export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-[min(1000px,calc(100%-48px))] py-20 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:py-12">
      <div className="mb-12">
        <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-accent">
          Legal
        </p>

        <h1 className="text-3xl font-medium tracking-tight max-[600px]:text-2xl">
          Privacy Policy
        </h1>

        <p className="mt-4 text-xs text-muted">
          Last updated: November 22, 2026
        </p>
      </div>

      <div className="space-y-10 text-sm leading-[1.9] text-muted">
        <section>
          <h2 className="mb-3 text-base font-medium text-foreground">
            1. Introduction
          </h2>

          <p>
            Welcome to Tasty Treat. We respect your privacy and are committed to
            protecting the personal information you provide while using our
            website.
          </p>

          <p className="mt-3">
            This Privacy Policy explains how information may be collected, used,
            stored, and protected when you visit or interact with Tasty Treat.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-medium text-foreground">
            2. Information We Collect
          </h2>

          <p>
            Depending on how you use our website, we may collect information
            such as:
          </p>

          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Account information:</strong>{" "}
              Information provided when registering or signing in, such as your
              name and email address.
            </li>

            <li>
              <strong className="text-foreground">Order information:</strong>{" "}
              Details associated with your food orders, including selected
              items, quantities, order history, and delivery or contact details
              where applicable.
            </li>

            <li>
              <strong className="text-foreground">
                Reservation information:
              </strong>{" "}
              Details submitted when making a table reservation, such as your
              name, contact information, reservation date, time, and party size.
            </li>

            <li>
              <strong className="text-foreground">Contact information:</strong>{" "}
              Information you provide when contacting us through our contact
              forms or other communication channels.
            </li>

            <li>
              <strong className="text-foreground">
                Technical information:
              </strong>{" "}
              Certain technical information may be processed to maintain website
              functionality, security, and reliability.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-medium text-foreground">
            3. How We Use Your Information
          </h2>

          <p>We may use the information we collect to:</p>

          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Create and manage user accounts.</li>
            <li>Process and manage food orders.</li>
            <li>Manage reservations and customer requests.</li>
            <li>Respond to customer inquiries.</li>
            <li>Maintain website functionality and security.</li>
            <li>Improve our services and user experience.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-medium text-foreground">
            4. Cookies and Browser Storage
          </h2>

          <p>
            Tasty Treat may use essential cookies or similar browser storage
            technologies to support functionality such as authentication,
            session management, security, and other essential website features.
          </p>

          <p className="mt-3">
            These technologies may be necessary for the website to function
            properly.
          </p>

          <p className="mt-3">
            We do not currently use cookies for advertising or cross-site
            tracking as part of the MVP.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-medium text-foreground">
            5. Third-Party Services
          </h2>

          <p>
            Tasty Treat uses third-party services to support website
            functionality, including Supabase for database services and
            authentication.
          </p>

          <p className="mt-3">
            Information may be processed by these service providers as necessary
            to provide their services. Their handling of information is also
            subject to their respective privacy policies and terms.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-medium text-foreground">
            6. Data Security
          </h2>

          <p>
            We take reasonable measures to protect information against
            unauthorized access, alteration, disclosure, or destruction.
          </p>

          <p className="mt-3">
            However, no internet-based service or method of electronic storage
            can be guaranteed to be completely secure.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-medium text-foreground">
            7. Data Retention
          </h2>

          <p>
            We retain information for as long as necessary to provide our
            services, maintain relevant records, fulfill operational
            requirements, and address legitimate business or legal needs.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-medium text-foreground">
            8. Your Privacy Rights
          </h2>

          <p>
            Depending on applicable laws, you may have rights concerning your
            personal information, including requesting access to, correction of,
            or deletion of certain information.
          </p>

          <p className="mt-3">
            You may contact us regarding privacy-related requests.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-medium text-foreground">
            9. Children&apos;s Privacy
          </h2>

          <p>
            Tasty Treat is not specifically designed to collect personal
            information from children. If you believe a child has provided
            personal information without appropriate authorization, please
            contact us.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-medium text-foreground">
            10. Changes to This Privacy Policy
          </h2>

          <p>
            We may update this Privacy Policy from time to time as our services,
            features, or practices evolve.
          </p>

          <p className="mt-3">
            Any updates will be published on this page along with the revised
            update date.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-medium text-foreground">
            11. Contact Us
          </h2>

          <p>
            If you have questions or concerns about this Privacy Policy or your
            personal information, please contact us through the contact
            information or contact page available on Tasty Treat.
          </p>

          <p className="mt-3">
            <a
              href="mailto:hello@tastytreat.example"
              className="text-foreground transition-colors hover:text-accent"
            >
              hello@tastytreat.example
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
