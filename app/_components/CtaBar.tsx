// app/_components/CtaBar.tsx
export default function CtaBar({ show = false }: { show?: boolean }) {
  if (!show) return null;

  const links = {
    clarity: process.env.NEXT_PUBLIC_STRIPE_LINK_CLARITY || "#",
    session: process.env.NEXT_PUBLIC_STRIPE_LINK_SESSION || "#",
    intensive: process.env.NEXT_PUBLIC_STRIPE_LINK_INTENSIVE || "#",
    program: process.env.NEXT_PUBLIC_STRIPE_LINK_PROGRAM || "#",
    skool: process.env.NEXT_PUBLIC_SKOOL_JOIN_URL || "#",
  };

  return (
    <div className="mt-3 rounded-xl border border-white/10 bg-[#0f141a] p-3">
      <p className="text-sm text-white/80">Want personalized help? Two easy ways:</p>
      <div className="flex flex-wrap gap-2 mt-2">
        <a href={links.clarity} className="btn btn-primary">Book $197 Clarity Call</a>
        <a href="/quiz" className="btn btn-ghost">Take Readiness Quiz</a>
        <a href="/enterprise" className="btn btn-ghost">Executive Toolkit</a>
      </div>
    </div>
  );
}
