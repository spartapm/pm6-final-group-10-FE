"use client";

import { useEffect, useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { assets } from "@/lib/assets";

export function AuthCarousel() {
  const [active, setActive] = useState(0);
  const slides = assets.carousel;

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative size-full overflow-hidden bg-[#FFF48E]">
      {slides.map((src, i) => (
        <div
          key={src + i}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <AssetImage
            src={src}
            alt={`캐러셀 슬라이드 ${i + 1}`}
            width={600}
            height={675}
            className="size-full object-cover"
            placeholderClassName="bg-[#FFF48E]"
            priority={i === 0}
          />
        </div>
      ))}

      <div className="absolute left-1/2 top-6 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-1 w-8 rounded-full transition-colors ${
              i === active ? "bg-dd-green" : "bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
