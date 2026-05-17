export function GlassCard({ children, className = '' }) {
  return (
    <div className={`backdrop-blur-lg bg-card/80 border border-border/50 shadow-xl rounded-xl ${className}`}>
      {children}
    </div>
  );
}
