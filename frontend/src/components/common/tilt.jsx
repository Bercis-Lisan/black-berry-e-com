import { useRef } from "react";

/**
 * Wraps children in a element that tilts in 3D toward the cursor,
 * with a soft glare highlight that follows the pointer. Pure CSS/JS,
 * no extra dependencies. Ignored on touch (no mousemove there).
 */
function Tilt3D({ children, className = "", max = 8, glare = true }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 2 * max;
    const rotateX = (0.5 - py) * 2 * max;

    el.style.transition = "transform 90ms ease-out";
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    const glareEl = el.querySelector("[data-tilt-glare]");
    if (glareEl) {
      glareEl.style.opacity = "1";
      glareEl.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%)`;
    }
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 600ms cubic-bezier(0.16,1,0.3,1)";
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    const glareEl = el.querySelector("[data-tilt-glare]");
    if (glareEl) glareEl.style.opacity = "0";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
      {glare && (
        <span
          data-tilt-glare
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
        />
      )}
    </div>
  );
}

export default Tilt3D;
