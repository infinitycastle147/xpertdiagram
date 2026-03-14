import React from "react";
import Image from "next/image";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeConfig = {
    xs: {
      dimensions: "w-5 h-5",
      imageSize: 20,
    },
    sm: {
      dimensions: "w-8 h-8",
      imageSize: 32,
    },
    md: {
      dimensions: "w-10 h-10 sm:w-11 sm:h-11",
      imageSize: 44,
    },
    lg: {
      dimensions: "w-14 h-14 sm:w-16 sm:h-16",
      imageSize: 64,
    },
    xl: {
      dimensions: "w-20 h-20 sm:w-24 sm:h-24",
      imageSize: 96,
    },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center justify-center ${config.dimensions} ${className}`}>
      <Image
        src="/logo.png"
        alt="XpertDiagram Logo"
        width={config.imageSize}
        height={config.imageSize}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
}
