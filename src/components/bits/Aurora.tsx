"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import "./aurora.css";

const LIGHT_COLORS = ["#d89c1b", "#093beb", "#e60808", "#03c423"];

const DARK_COLORS = ["#5b21b6", "#0772a0", "#ad0b23", "#06844f"];

const HOME_CORNERS: [number, number][] = [
  [0, 0],
  [100, 0],
  [0, 100],
  [100, 100],
];

const WANDER_RANGE = 55;
const WAYPOINT_INTERVAL_MS = 2000;

function meshBackground(colors: string[], mix: number): string {
  return colors
    .map(
      (color) =>
        `radial-gradient(circle, color-mix(in srgb, ${color} ${mix}%, transparent), transparent 65%)`,
    )
    .join(", ");
}

function randomWaypoint(home: [number, number]): string {
  const x = Math.min(
    100,
    Math.max(0, home[0] + (Math.random() * 2 - 1) * WANDER_RANGE),
  );
  const y = Math.min(
    100,
    Math.max(0, home[1] + (Math.random() * 2 - 1) * WANDER_RANGE),
  );
  return `${x.toFixed(1)}% ${y.toFixed(1)}%`;
}

function nextWaypoints(): string[] {
  return HOME_CORNERS.map(randomWaypoint);
}

export default function Aurora({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;
  const [positions, setPositions] = useState<string[]>(() =>
    HOME_CORNERS.map(([x, y]) => `${x}% ${y}%`),
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const tick = () => setPositions(nextWaypoints());
    const start = () => {
      if (timerRef.current) return;
      timerRef.current = setInterval(tick, WAYPOINT_INTERVAL_MS);
    };
    const stop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        tick();
        start();
      }
    };

    tick();
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn("aurora-mesh pointer-events-none", className)}
      style={{
        backgroundImage: meshBackground(colors, isDark ? 70 : 50),
        backgroundPosition: positions.join(", "),
      }}
    />
  );
}
