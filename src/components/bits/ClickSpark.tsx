"use client";

import { useEffect, useRef, useState } from "react";

export type ClickSparkProps = {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  extraScale?: number;
};

type Spark = {
  x: number;
  y: number;
  angle: number;
  startTime: number;
};

function ClickSparkCanvas({
  sparkColor = "#ffffff",
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 400,
  extraScale = 1.0,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animationRef = useRef<number | null>(null);
  const propsRef = useRef({
    sparkColor,
    sparkSize,
    sparkRadius,
    sparkCount,
    duration,
    extraScale,
  });

  useEffect(() => {
    propsRef.current = {
      sparkColor,
      sparkSize,
      sparkRadius,
      sparkCount,
      duration,
      extraScale,
    };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let resizeTimeout: ReturnType<typeof setTimeout>;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.floor(window.innerWidth * dpr);
      const height = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    const stopLoop = () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    const draw = (timestamp: number) => {
      const {
        sparkColor: color,
        sparkSize: size,
        sparkRadius: radius,
        duration: life,
        extraScale: scale,
      } = propsRef.current;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= life) return false;

        const progress = elapsed / life;
        const eased = progress * (2 - progress);
        const distance = eased * radius * scale;
        const lineLength = size * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return true;
      });

      if (sparksRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(draw);
      } else {
        animationRef.current = null;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const kick = () => {
      if (animationRef.current === null) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const { sparkCount: count } = propsRef.current;
      const now = performance.now();
      for (let i = 0; i < count; i++) {
        sparksRef.current.push({
          x: e.clientX,
          y: e.clientY,
          angle: (2 * Math.PI * i) / count,
          startTime: now,
        });
      }
      kick();
    };

    resizeCanvas();
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      stopLoop();
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100vw", height: "100vh", display: "block" }}
      />
    </div>
  );
}

export default function ClickSpark(props: ClickSparkProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setEnabled(true);
    }
  }, []);

  if (!enabled) return null;
  return <ClickSparkCanvas {...props} />;
}
