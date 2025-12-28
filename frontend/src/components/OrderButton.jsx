import { useRef, useState } from "react";

export default function SlideToOrder({ onConfirm }) {
  const containerRef = useRef(null);
  const ringRef = useRef(null);

  const [dragging, setDragging] = useState(false);
  const [translateX, setTranslateX] = useState(0);

  const handleStart = () => setDragging(true);

  const handleMove = (e) => {
    if (!dragging) return;

    const container = containerRef.current;
    const ring = ringRef.current;

    const containerRect = container.getBoundingClientRect();
    const ringWidth = ring.offsetWidth;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;

    let newX = clientX - containerRect.left - ringWidth / 2;
    const maxX = containerRect.width - ringWidth;

    newX = Math.max(0, Math.min(newX, maxX));
    setTranslateX(newX);
  };

  const handleEnd = () => {
    const container = containerRef.current;
    const ring = ringRef.current;

    const maxX = container.offsetWidth - ring.offsetWidth;

    if (translateX >= maxX * 0.95) {
      setTranslateX(maxX);
      onConfirm?.(); // 🔥 ORDER CONFIRMED
    } else {
      setTranslateX(0); // snap back
    }

    setDragging(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      className="relative w-full max-w-sm h-14 bg-gray-200 rounded-full overflow-hidden select-none"
    >
      <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-semibold">
        Slide to place order →
      </div>

      <div
        ref={ringRef}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        style={{ transform: `translateX(${translateX}px)` }}
        className="absolute top-1 left-1 h-12 w-12 bg-[#cd0045] rounded-full shadow-lg cursor-pointer transition-transform"
      />
    </div>
  );
}