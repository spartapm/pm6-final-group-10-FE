"use client";

import Image from "next/image";
import { useState } from "react";

interface AssetImageProps {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  placeholderClassName?: string;
  priority?: boolean;
}

export function AssetImage({
  src,
  alt,
  width,
  height,
  className = "",
  placeholderClassName = "bg-[#D9D9D9]",
  priority,
}: AssetImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center ${placeholderClassName} ${className}`}
        style={{ width, height }}
        aria-label={alt}
        role="img"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}
