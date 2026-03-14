"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { BACKEND_CONFIG } from "@/constants";
import { LoadingSpinner } from "./ui/loading";

interface BackendHealthGatewayProps {
  children: React.ReactNode;
}

export function BackendHealthGateway({ children }: BackendHealthGatewayProps) {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkBackendHealth = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        BACKEND_CONFIG.TIMEOUT
      );

      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}/`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log("Backend health check timed out");
      } else {
        console.log("Backend health check failed:", error);
      }
      return false;
    }
  }, []);

  const performHealthCheck = useCallback(async () => {
    const healthy = await checkBackendHealth();

    if (healthy) {
      setIsHealthy(true);
      setRetryCount(0);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      setIsHealthy(false);
      setRetryCount((prev) => {
        const newCount = prev + 1;
        if (newCount <= BACKEND_CONFIG.MAX_RETRIES) {
          // Schedule next retry
          timeoutRef.current = setTimeout(() => {
            performHealthCheck();
          }, BACKEND_CONFIG.HEALTH_CHECK_INTERVAL);
        }
        return newCount;
      });
    }
  }, [checkBackendHealth]);

  useEffect(() => {
    performHealthCheck();
    
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [performHealthCheck]);

  // Show backend waking up message
  if (isHealthy === null && !isHealthy && retryCount <= BACKEND_CONFIG.MAX_RETRIES) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto">
            <LoadingSpinner size="lg" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Backend instance is waking up
            </h2>
            <p className="text-muted-foreground">
              Please wait while we start the backend services...
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Retry attempt:</span>
              <span className="font-medium">
                {retryCount} / {BACKEND_CONFIG.MAX_RETRIES}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(retryCount / BACKEND_CONFIG.MAX_RETRIES) * 100}%`,
                }}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            This usually takes 1-2 minutes for the first request
          </p>
        </div>
      </div>
    );
  }

  // Show maintenance message after max retries
  if (!isHealthy && retryCount > BACKEND_CONFIG.MAX_RETRIES) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Service Temporarily Unavailable
            </h2>
            <p className="text-muted-foreground">
              We're sorry, but the application is currently under maintenance.
              Please try again later.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              If this issue persists, please contact support:
            </p>
            <a
              href="mailto:support@xpertdiagram.com"
              className="text-sm text-primary hover:underline font-medium"
            >
              support@xpertdiagram.com
            </a>
          </div>

          <button
            onClick={() => {
              setRetryCount(0);
              setIsHealthy(null);
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
              performHealthCheck();
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Backend is healthy, render the application
  return <>{children}</>;
}
