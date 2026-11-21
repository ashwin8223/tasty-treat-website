export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-border" />

        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent border-r-accent motion-reduce:animate-none" />

        <span className="text-lg font-bold text-accent">T</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-extrabold tracking-[0.25em] text-foreground">
          TASTY TREAT
        </p>

        <p className="animate-pulse text-sm text-muted-foreground motion-reduce:animate-none">
          Preparing something delicious...
        </p>
      </div>
    </div>
  );
}
