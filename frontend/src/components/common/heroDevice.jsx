import { Wifi, Battery, Signal, Sparkles, ShieldCheck } from "lucide-react";
import Tilt3D from "./tilt";

function HeroDevice() {
  return (
    <div className="relative mx-auto flex w-full max-w-[300px] items-center justify-center [perspective:1400px] sm:max-w-[340px]">
      {/* Ambient glow beneath the device */}
      <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 blur-3xl" />

      <Tilt3D max={14} className="w-full rounded-[2.75rem]">
        <div className="animate-float-slow" style={{ transformStyle: "preserve-3d" }}>
          <div
            className="relative rounded-[2.75rem] border-[6px] border-ink/90 bg-ink shadow-2xl shadow-black/40"
            style={{ transform: "rotateY(-14deg) rotateX(5deg)", transformStyle: "preserve-3d" }}
          >
            {/* Dynamic island / notch */}
            <div className="absolute left-1/2 top-3 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />

            {/* Screen */}
            <div className="aspect-[9/18.5] w-full overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-berry-dark via-berry to-berry-light bg-200% p-4 animate-gradient-shift">
              {/* Status bar */}
              <div className="flex items-center justify-between px-1 text-[10px] font-semibold text-white/90">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <Signal className="h-3 w-3" />
                  <Wifi className="h-3 w-3" />
                  <Battery className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Mini "app" content */}
              <div className="mt-8 flex flex-col items-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                  <Sparkles className="h-6 w-6 text-white" strokeWidth={1.5} />
                </span>
                <p className="mt-3 text-sm font-bold text-white">Berry Phone 15 Pro</p>
                <p className="text-[11px] text-white/70">Titanium. Reimagined.</p>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-2.5 px-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl bg-white/12 backdrop-blur-sm"
                  />
                ))}
              </div>

              <div className="mt-auto" />
            </div>
          </div>

          {/* Ground reflection */}
          <div className="mx-auto mt-5 h-8 w-[72%] rounded-full bg-black/25 blur-xl" />
        </div>
      </Tilt3D>

      {/* Floating spec badges for depth/parallax feel */}
      <div className="pointer-events-none absolute -left-2 top-10 hidden animate-float-slow rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-left text-white shadow-lift backdrop-blur-md sm:block">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/60">Chip</p>
        <p className="text-xs font-bold">B18 Pro</p>
      </div>

      <div className="pointer-events-none absolute -right-4 bottom-16 hidden animate-float-slow-delay items-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-white shadow-lift backdrop-blur-md sm:flex">
        <ShieldCheck className="h-3.5 w-3.5" />
        <p className="text-xs font-semibold">IP68 rated</p>
      </div>
    </div>
  );
}

export default HeroDevice;
