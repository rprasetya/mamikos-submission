"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchSection } from "@/lib/api";

const LOADING = { status: "loading", items: [], error: null };

// Loads one section list from GET /api/sections/:name.
// Returns { status: "loading" | "success" | "error", items, error, retry }.
export default function useSection(name) {
  const [state, setState] = useState(LOADING);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchSection(name, { signal: controller.signal })
      .then((items) => setState({ status: "success", items, error: null }))
      .catch((error) => {
        if (error.name === "AbortError") return;
        console.error(`[sections] ${name} failed:`, error);
        setState({ status: "error", items: [], error });
      });

    return () => controller.abort();
  }, [name, attempt]);

  const retry = useCallback(() => {
    setState(LOADING);
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}
