export function Container({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mx-auto max-w-6xl px-6 lg:px-8 ${className}`}>{children}</div>;
}
