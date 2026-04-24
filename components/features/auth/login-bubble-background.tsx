"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ─── constants (tuned for full-screen use) ─────────────────────────────────
const BUBBLE_COUNT = 10;
// Drift speed — increase to make bubbles move faster, decrease to slow down.
const DRIFT_MIN_MS = 45_000;
const DRIFT_MAX_MS = 80_000;
const WAYPOINTS = 3;
const OVERSHOOT = 0.2;

// ─── math helpers ──────────────────────────────────────────────────────────
function clamp(v: number, lo: number, hi: number) {
    return Math.min(Math.max(v, lo), hi);
}

function normalizeHue(h: number) {
    return ((h % 360) + 360) % 360;
}

function rand(lo: number, hi: number) {
    return lo + (hi - lo) * Math.random();
}

// ─── bubble spec ──────────────────────────────────────────────────────────
type BubbleSpec = {
    id: number;
    /** Initial position as a fraction of the container size. */
    initFx: number;
    initFy: number;
    width: number;
    height: number;
    color: string;
    highlight: string;
    opacity: number;
};

function buildBubbles(): BubbleSpec[] {
    return Array.from({ length: BUBBLE_COUNT }, (_, i) => {
        const hue = normalizeHue(220 + rand(-35, 35));
        const sat = clamp(68 + rand(-10, 10), 0, 100);
        const lit = clamp(72 + rand(-10, 10), 0, 100);
        const alpha = clamp(0.38 + rand(-0.06, 0.06), 0.05, 1);
        const w = rand(440, 780);
        return {
            id: i,
            initFx: rand(-0.05, 1.05),
            initFy: rand(-0.05, 1.05),
            width: w,
            height: w * rand(0.82, 1.22),
            color: `hsl(${hue.toFixed(0)} ${sat.toFixed(0)}% ${lit.toFixed(0)}%)`,
            highlight: `hsl(${hue.toFixed(0)} ${clamp(sat + 8, 0, 100).toFixed(0)}% ${clamp(lit + 18, 0, 100).toFixed(0)}%)`,
            opacity: alpha,
        };
    });
}

// ─── backdrop (static) ───────────────────────────────────────────────────
const BACKDROP = [
    "radial-gradient(circle at 18% 14%, hsl(220 44% 97% / 0.9), transparent 42%)",
    "radial-gradient(circle at 82% 78%, hsl(255 36% 93% / 0.72), transparent 46%)",
    "linear-gradient(180deg, hsl(220 34% 98%), hsl(255 28% 94%))",
].join(",");

const OVERLAY =
    "linear-gradient(180deg, hsl(220 26% 99% / 0.14), hsl(255 18% 98% / 0.2))";

const VIGNETTE =
    "radial-gradient(circle at center, transparent 26%, rgba(255,255,255,0.14) 100%)";

// ─── single animated bubble ──────────────────────────────────────────────
function Bubble({
    spec,
    containerSize,
    reducedMotion,
}: {
    spec: BubbleSpec;
    containerSize: { width: number; height: number };
    reducedMotion: boolean;
}) {
    const el = useRef<HTMLDivElement>(null);
    const sizeRef = useRef(containerSize);

    useEffect(() => {
        sizeRef.current = containerSize;
    }, [containerSize]);

    useEffect(() => {
        if (reducedMotion || !el.current) return;

        let anim: Animation | null = null;
        let cancelled = false;
        let cx = 0;
        let cy = 0;
        let initialized = false;

        function drift() {
            if (cancelled || !el.current) return;
            const { width, height } = sizeRef.current;
            const startX = initialized ? cx : spec.initFx * width;
            const startY = initialized ? cy : spec.initFy * height;
            initialized = true;

            const keyframes: Keyframe[] = [
                { transform: `translate3d(${startX.toFixed(0)}px,${startY.toFixed(0)}px,0)` },
            ];
            for (let i = 0; i < WAYPOINTS; i++) {
                cx = (-OVERSHOOT + Math.random() * (1 + 2 * OVERSHOOT)) * width;
                cy = (-OVERSHOOT + Math.random() * (1 + 2 * OVERSHOOT)) * height;
                keyframes.push({
                    transform: `translate3d(${cx.toFixed(0)}px,${cy.toFixed(0)}px,0)`,
                });
            }

            anim = el.current.animate(keyframes, {
                duration: DRIFT_MIN_MS + Math.random() * (DRIFT_MAX_MS - DRIFT_MIN_MS),
                easing: "ease-in-out",
                fill: "both",
            });
            anim.onfinish = drift;
        }

        drift();
        return () => {
            cancelled = true;
            anim?.cancel();
        };
    }, [reducedMotion, spec]);

    return (
        <div
            ref={el}
            className="absolute rounded-full will-change-transform"
            style={{
                transform: `translate3d(${(spec.initFx * containerSize.width).toFixed(0)}px,${(spec.initFy * containerSize.height).toFixed(0)}px,0)`,
                width: spec.width,
                height: spec.height,
                background: `radial-gradient(circle at 30% 30%, ${spec.highlight}, ${spec.color} 56%, transparent 88%)`,
                opacity: spec.opacity,
            }}
        />
    );
}

// ─── main export ─────────────────────────────────────────────────────────
export function LoginBubbleBackground({ className }: { className?: string }) {
    const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
    // Built once per mount so every page load gets a fresh random layout.
    const bubbles = useMemo(() => buildBubbles(), []);
    const containerRef = useRef<HTMLDivElement>(null);
    // Start with a typical large-screen size so the first drift segment distributes
    // bubbles across the full screen rather than a narrow sidebar-sized strip.
    const [containerSize, setContainerSize] = useState({ width: 1440, height: 900 });

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReducedMotion(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            setContainerSize({ width: rect.width, height: rect.height });
        }
        const ro = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            if (width > 0 && height > 0) setContainerSize({ width, height });
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    if (reducedMotion === null) {
        return (
            <div
                className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
                aria-hidden="true"
            />
        );
    }

    return (
        <div
            className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
            aria-hidden="true"
        >
            <div className="absolute inset-0" style={{ background: BACKDROP }} />
            <div
                ref={containerRef}
                className="absolute -inset-25"
                style={{ filter: "blur(65px)", transform: "translateZ(0)" }}
            >
                {bubbles.map((b) => (
                    <Bubble
                        key={b.id}
                        spec={b}
                        containerSize={containerSize}
                        reducedMotion={reducedMotion}
                    />
                ))}
            </div>
            <div className="absolute inset-0" style={{ background: OVERLAY }} />
            <div className="absolute inset-0" style={{ background: VIGNETTE }} />
        </div>
    );
}
