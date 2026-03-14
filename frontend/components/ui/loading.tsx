"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  /** Loading text to display */
  text?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg" | "xl";
  /** Spinner variant */
  variant?: "default" | "minimal" | "skeleton" | "dots";
  /** Full screen/container loading */
  fullScreen?: boolean;
  /** Custom className */
  className?: string;
  /** Show the loading indicator inline */
  inline?: boolean;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const textSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

export function Loading({
  text,
  size = "md",
  variant = "default",
  fullScreen = false,
  className,
  inline = false,
}: LoadingProps) {
  if (variant === "skeleton") {
    return (
      <div
        className={cn(
          "loading-skeleton rounded-md",
          size === "sm" && "h-4",
          size === "md" && "h-6",
          size === "lg" && "h-8",
          size === "xl" && "h-12",
          className
        )}
      />
    );
  }

  if (variant === "dots") {
    return (
      <div
        className={cn(
          "flex items-center justify-center space-x-1",
          fullScreen && "min-h-screen",
          inline && "inline-flex",
          className
        )}
      >
        <div className="flex items-center space-x-1">
          <div
            className={cn(
              "bg-primary rounded-full animate-pulse",
              size === "sm" && "w-1.5 h-1.5",
              size === "md" && "w-2 h-2",
              size === "lg" && "w-2.5 h-2.5",
              size === "xl" && "w-3 h-3"
            )}
            style={{ animationDelay: "0ms" }}
          />
          <div
            className={cn(
              "bg-primary rounded-full animate-pulse",
              size === "sm" && "w-1.5 h-1.5",
              size === "md" && "w-2 h-2",
              size === "lg" && "w-2.5 h-2.5",
              size === "xl" && "w-3 h-3"
            )}
            style={{ animationDelay: "150ms" }}
          />
          <div
            className={cn(
              "bg-primary rounded-full animate-pulse",
              size === "sm" && "w-1.5 h-1.5",
              size === "md" && "w-2 h-2",
              size === "lg" && "w-2.5 h-2.5",
              size === "xl" && "w-3 h-3"
            )}
            style={{ animationDelay: "300ms" }}
          />
        </div>
        {text && (
          <span className={cn("ml-2 text-muted-foreground", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div
        className={cn(
          "flex items-center justify-center",
          fullScreen && "min-h-screen",
          inline && "inline-flex",
          className
        )}
      >
        <div
          className={cn(
            "border-2 border-muted border-t-primary rounded-full animate-spin",
            sizeClasses[size]
          )}
        />
        {text && (
          <span className={cn("ml-2 text-muted-foreground", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        fullScreen && "min-h-screen",
        inline && "inline-flex",
        className
      )}
    >
      <div className="text-center">
        <Loader2 className={cn("animate-spin mx-auto mb-2 text-primary", sizeClasses[size])} />
        {text && (
          <p className={cn("text-muted-foreground", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

// Preset loading components for common use cases
export const LoadingPage = () => (
  <Loading text="Loading..." size="lg" fullScreen />
);

export const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) => (
  <Loading size={size} inline />
);

export const LoadingText = ({ text, size = "md" }: { text: string; size?: "sm" | "md" | "lg" | "xl" }) => (
  <Loading text={text} size={size} />
);

export const LoadingDots = ({ text, size = "md" }: { text?: string; size?: "sm" | "md" | "lg" | "xl" }) => (
  <Loading text={text} size={size} variant="dots" />
);

export const LoadingSkeleton = ({ className }: { className?: string }) => (
  <Loading variant="skeleton" className={className} />
);

export const LoadingMinimal = ({ text, size = "md" }: { text?: string; size?: "sm" | "md" | "lg" | "xl" }) => (
  <Loading text={text} size={size} variant="minimal" />
);