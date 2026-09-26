import { useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import ProductArt from "./productArt";

function ProductSpin({ category, className = "" }) {
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const lastX = useRef(0);

  const onPointerDown = (e) => {
    setDragging(true);
    lastX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    setRotation((r) => r + dx * 0.6);
  };

  const stopDrag = () => setDragging(false);

  return (
    <div
      className={`relative touch-none select-none overflow-hidden rounded-3xl bg-mist ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      } ${className}`}
      style={{ perspective: "1200px" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerLeave={stopDrag}
    >
      <div
        className="h-full w-full"
        style={{
          transform: `rotateY(${rotation}deg)`,
          transformStyle: "preserve-3d",
          transition: dragging ? "none" : "transform 500ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <ProductArt category={category} className="h-full w-full" />
      </div>

      <span className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-ink/70 px-3.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm">
        <RotateCw className="h-3 w-3" /> Drag to rotate
      </span>
    </div>
  );
}

export default ProductSpin;
