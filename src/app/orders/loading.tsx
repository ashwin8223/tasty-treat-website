export default function OrdersLoading() {
  return (
    <section className="mx-auto min-h-[65vh] w-[min(1160px,calc(100%-48px))] pt-18.75 pb-25 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:pt-13.75 max-[700px]:pb-17.5">
      <div className="animate-pulse">
        {/* Page heading */}
        <div className="h-3 w-24 rounded bg-accent/20" />

        <div className="mt-5 mb-8.75 h-14 w-64 max-w-full rounded-lg bg-surface-2" />

        <div className="-mt-3 mb-8 h-4 w-80 max-w-full rounded bg-surface-2" />

        {/* Order cards */}
        <div className="grid gap-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <article
              key={index}
              className="rounded-xl border border-line bg-surface p-6.25 max-[520px]:p-4.5"
            >
              {/* Order header */}
              <div className="flex items-start justify-between gap-3.75 border-b border-line pb-5 max-[520px]:flex-col">
                <div className="flex flex-col gap-2">
                  <div className="h-2.5 w-24 rounded bg-surface-2" />
                  <div className="h-5 w-36 rounded bg-surface-2" />
                </div>

                <div className="h-6 w-24 rounded-full bg-surface-2" />
              </div>

              {/* Date & payment */}
              <div className="flex flex-wrap gap-5 py-4 max-[520px]:gap-3">
                <div className="h-3 w-36 rounded bg-surface-2" />
                <div className="h-3 w-32 rounded bg-surface-2" />
              </div>

              {/* Items */}
              <div className="grid gap-3.25 border-y border-line py-4.5">
                {Array.from({ length: index === 1 ? 3 : 2 }).map(
                  (_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between gap-3.75"
                    >
                      <div className="h-3 w-48 max-w-[70%] rounded bg-surface-2" />
                      <div className="h-3 w-16 rounded bg-surface-2" />
                    </div>
                  ),
                )}
              </div>

              {/* Payment status & total */}
              <div className="flex items-center justify-between gap-3.75 pt-4.5 max-[520px]:items-end">
                <div className="grid gap-2">
                  <div className="h-2.5 w-24 rounded bg-surface-2" />
                  <div className="h-3 w-20 rounded bg-surface-2" />
                </div>

                <div className="grid justify-items-end gap-2">
                  <div className="h-2.5 w-12 rounded bg-surface-2" />
                  <div className="h-6 w-24 rounded bg-accent/15" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom action */}
        <div className="mt-8.75 flex justify-center">
          <div className="h-12 w-64 max-w-full rounded-lg bg-accent/15" />
        </div>
      </div>
    </section>
  );
}
