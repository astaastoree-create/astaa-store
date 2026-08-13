import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex flex-col items-center leading-none ${className}`}>
      <span className="font-display text-2xl font-semibold tracking-tight italic">Astaa</span>
      <span className="eyebrow mt-0.5 text-[0.55rem] opacity-70">Store</span>
    </Link>
  );
}
