"use client";
import { useRef, useState, useEffect } from "react";

export default function DraggableRow({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // --- Mouse events ---
  const mouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const slider = ref.current;
    setIsDown(true);
    slider.classList.add("cursor-grabbing");
    const rect = slider.getBoundingClientRect();
    setStartX(e.pageX - rect.left);
    setScrollLeft(slider.scrollLeft);
  };

  const mouseUpOrLeave = () => {
    setIsDown(false);
    ref.current?.classList.remove("cursor-grabbing");
  };

  const mouseMove = (e: React.MouseEvent) => {
    if (!isDown || !ref.current) return;
    e.preventDefault();
    const slider = ref.current;
    const rect = slider.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const walk = (x - startX) * 2; // rýchlosť posuvu
    slider.scrollLeft = scrollLeft - walk;
  };

  // --- Touch events (mobil) ---
  const touchStart = (e: React.TouchEvent) => {
    if (!ref.current) return;
    const slider = ref.current;
    setIsDown(true);
    const rect = slider.getBoundingClientRect();
    setStartX(e.touches[0].pageX - rect.left);
    setScrollLeft(slider.scrollLeft);
  };

  const touchMove = (e: React.TouchEvent) => {
    if (!isDown || !ref.current) return;
    const slider = ref.current;
    const rect = slider.getBoundingClientRect();
    const x = e.touches[0].pageX - rect.left;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  };

  const touchEnd = () => {
    setIsDown(false);
  };

  // --- Reset scroll na resize ---
  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setScrollLeft(ref.current.scrollLeft);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={ref}
      onMouseDown={mouseDown}
      onMouseLeave={mouseUpOrLeave}
      onMouseUp={mouseUpOrLeave}
      onMouseMove={mouseMove}
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
      className="flex overflow-x-auto no-scrollbar space-x-4 pb-2 cursor-grab select-none scroll-smooth"
    >
      {children}
    </div>
  );
}
