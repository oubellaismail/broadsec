"use client";

import { useEffect, useState } from "react";
import { getHealth } from "@/lib/api";
import { FALLBACK_HEALTH } from "@/lib/mock-data";
import type { HealthResponse } from "@/types";

interface ApiHealthState {
  health: HealthResponse;
  isLoading: boolean;
  isFallback: boolean;
  error?: string;
}

export function useApiHealth(): ApiHealthState {
  const [state, setState] = useState<ApiHealthState>({
    health: FALLBACK_HEALTH,
    isLoading: true,
    isFallback: true,
  });

  useEffect(() => {
    let active = true;

    getHealth()
      .then((health) => {
        if (!active) return;
        setState({ health, isLoading: false, isFallback: false });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState({
          health: FALLBACK_HEALTH,
          isLoading: false,
          isFallback: true,
          error:
            error instanceof Error
              ? error.message
              : "BroadSec API is not reachable.",
        });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
