"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./sidebar-bubble-background.module.css";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type BubbleTheme = {
    /** Stable key — changing it triggers a crossfade to a new layout. */
    key: string;
    /** Base hue in degrees (0–360). */
    hue: number;
    /** Hue variation across bubbles in degrees. @default 20 */
    hueSpread?: number;
    /** Saturation percentage (0–100). @default 80 */
    saturation?: number;
    /** Lightness percentage (0–100). @default 70 */
    lightness?: number;
    /** Bubble opacity (0–1). @default 0.38 */
    opacity?: number;
    /** Softening overlay strength (0–1). @default 0.2 */
    overlay?: number;
};

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

type ResolvedTheme = {
    key: string;
    hue: number;
    hueSpread: number;
    saturation: number;
    lightness: number;
    opacity: number;
    overlay: number;
};

type BubbleSpec = {
    id: string;
    /** Initial horizontal position as a fraction of the container width (-0.5 to 1.5). */
    initFx: number;
    /** Initial vertical position as a fraction of the container height (-0.3 to 1.3). */
    initFy: number;
    width: number;
    height: number;
    highlightColor: string;
    color: string;
    opacity: number;
};

type LayerState = {
    id: string;
    theme: ResolvedTheme;
    seed: number;
    mode: "enter" | "exit";
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BUBBLE_COUNT = 12;
const EXIT_MS = 900;
const DRIFT_MIN_MS = 35_000;
const DRIFT_MAX_MS = 60_000;
const WAYPOINTS_PER_SEGMENT = 4;
/** Fraction of the container dimension that bubbles may overshoot beyond each edge. */
const DRIFT_OVERSHOOT = 0.3;

// ---------------------------------------------------------------------------
// Math utilities
// ---------------------------------------------------------------------------

function clamp(v: number, min: number, max: number) {
    return Math.min(Math.max(v, min), max);
}

function normalizeHue(h: number) {
    return ((h % 360) + 360) % 360;
}

function hashString(s: string) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function createRng(seed: number) {
    let s = seed || 1;
    return () => {
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function pickBetween(rng: () => number, min: number, max: number) {
    return min + (max - min) * rng();
}

// ---------------------------------------------------------------------------
// Theme resolution
// ---------------------------------------------------------------------------

function resolveTheme(theme?: BubbleTheme): ResolvedTheme {
    return {
        key: theme?.key ?? "default",
        hue: normalizeHue(theme?.hue ?? 28),
        hueSpread: clamp(theme?.hueSpread ?? 20, 0, 180),
        saturation: clamp(theme?.saturation ?? 80, 0, 100),
        lightness: clamp(theme?.lightness ?? 70, 0, 100),
        opacity: clamp(theme?.opacity ?? 0.38, 0, 1),
        overlay: clamp(theme?.overlay ?? 0.2, 0, 1),
    };
}

function themeSignature(t: ResolvedTheme) {
    return `${t.key}:${t.hue}:${t.hueSpread}:${t.saturation}:${t.lightness}:${t.opacity}:${t.overlay}`;
}

// ---------------------------------------------------------------------------
// Bubble generation
// ---------------------------------------------------------------------------

function buildBubbles(theme: ResolvedTheme, layerId: string, seed: number): BubbleSpec[] {
    const rng = createRng(hashString(`${seed}:${layerId}`));

    return Array.from({ length: BUBBLE_COUNT }, (_, i) => {
        const hue = normalizeHue(theme.hue + pickBetween(rng, -theme.hueSpread, theme.hueSpread));
        const sat = clamp(theme.saturation + pickBetween(rng, -12, 12), 0, 100);
        const lit = clamp(theme.lightness + pickBetween(rng, -12, 12), 0, 100);
        const alpha = clamp(theme.opacity + pickBetween(rng, -0.08, 0.08), 0.05, 1);
        const width = pickBetween(rng, 180, 360);

        return {
            id: `${layerId}-${i}`,
            initFx: pickBetween(rng, -0.5, 1.5),
            initFy: pickBetween(rng, -0.3, 1.3),
            width,
            height: width * pickBetween(rng, 0.82, 1.22),
            highlightColor: `hsl(${hue.toFixed(0)} ${clamp(sat + 8, 0, 100).toFixed(0)}% ${clamp(lit + 18, 0, 100).toFixed(0)}%)`,
            color: `hsl(${hue.toFixed(0)} ${sat.toFixed(0)}% ${lit.toFixed(0)}%)`,
            opacity: alpha,
        };
    });
}

// ---------------------------------------------------------------------------
// Static gradients
// ---------------------------------------------------------------------------

function buildBackdrop(theme: ResolvedTheme): string {
    const s = clamp(theme.saturation - 24, 10, 80);
    const h2 = normalizeHue(theme.hue + Math.max(theme.hueSpread, 18));
    return [
        `radial-gradient(circle at 18% 14%, hsl(${theme.hue} ${clamp(s - theme.hueSpread * 0.4, 0, 100).toFixed(0)}% 97% / 0.9), transparent 42%)`,
        `radial-gradient(circle at 82% 78%, hsl(${h2} ${clamp(s - theme.hueSpread * 0.8, 0, 100).toFixed(0)}% 93% / 0.72), transparent 46%)`,
        `linear-gradient(180deg, hsl(${theme.hue} ${clamp(s - 10, 5, 80)}% 98%), hsl(${h2} ${clamp(s - 15, 5, 72)}% 94%))`,
    ].join(",");
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useReducedMotion() {
    const [reduced, setReduced] = useState<boolean | null>(null);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduced(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    return reduced;
}

// ---------------------------------------------------------------------------
// Bubble (Web Animations API — non-repeating, GPU-composited drift)
// ---------------------------------------------------------------------------

function Bubble({
    spec,
    containerSize,
    reducedMotion,
    mode,
}: {
    spec: BubbleSpec;
    containerSize: { width: number; height: number };
    reducedMotion: boolean;
    mode: "enter" | "exit";
}) {
    const ref = useRef<HTMLDivElement>(null);
    const sizeRef = useRef(containerSize);

    useEffect(() => {
        sizeRef.current = containerSize;
    }, [containerSize]);

    useEffect(() => {
        if (reducedMotion || mode === "exit" || !ref.current) return;

        let animation: Animation | null = null;
        let cancelled = false;
        let cx = 0;
        let cy = 0;
        let initialized = false;

        function drift() {
            if (cancelled || !ref.current) return;

            const { width, height } = sizeRef.current;

            // On first call, seed the starting position from the spec's initial fraction.
            // After that, continue from wherever the last segment ended.
            const startX = initialized ? cx : spec.initFx * width;
            const startY = initialized ? cy : spec.initFy * height;
            initialized = true;

            const keyframes: Keyframe[] = [
                { transform: `translate3d(${startX.toFixed(0)}px, ${startY.toFixed(0)}px, 0)` },
            ];

            for (let i = 0; i < WAYPOINTS_PER_SEGMENT; i++) {
                // Pick anywhere within the container + overshoot margin on each side.
                cx = (-DRIFT_OVERSHOOT + Math.random() * (1 + 2 * DRIFT_OVERSHOOT)) * width;
                cy = (-DRIFT_OVERSHOOT + Math.random() * (1 + 2 * DRIFT_OVERSHOOT)) * height;
                keyframes.push({ transform: `translate3d(${cx.toFixed(0)}px, ${cy.toFixed(0)}px, 0)` });
            }

            animation = ref.current.animate(keyframes, {
                duration: DRIFT_MIN_MS + Math.random() * (DRIFT_MAX_MS - DRIFT_MIN_MS),
                easing: "ease-in-out",
                // "both" applies the first keyframe before playback starts,
                // so the bubble appears at its seeded position on first render.
                fill: "both",
            });

            animation.onfinish = drift;
        }

        drift();

        return () => {
            cancelled = true;
            animation?.cancel();
        };
    }, [reducedMotion, mode, spec]);

    return (
        <div
            ref={ref}
            className="absolute rounded-full will-change-transform"
            style={{
                // Provides correct initial placement for both cases:
                // - Reduced motion: this is the final static position.
                // - Animated: WAAPI overrides this, but it prevents a 0,0 flash.
                transform: `translate3d(${(spec.initFx * containerSize.width).toFixed(0)}px, ${(spec.initFy * containerSize.height).toFixed(0)}px, 0)`,
                width: spec.width,
                height: spec.height,
                background: `radial-gradient(circle at 30% 30%, ${spec.highlightColor}, ${spec.color} 56%, transparent 88%)`,
                opacity: spec.opacity,
            }}
        />
    );
}

// ---------------------------------------------------------------------------
// BubbleLayer
// ---------------------------------------------------------------------------

function BubbleLayer({ layer, reducedMotion }: { layer: LayerState; reducedMotion: boolean }) {
    const bubbles = useMemo(
        () => buildBubbles(layer.theme, layer.id, layer.seed),
        [layer.theme, layer.id, layer.seed],
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 400, height: 800 });

    // useLayoutEffect so the initial size is measured synchronously before paint.
    // This means children receive correct dimensions before their own effects fire,
    // and reduced-motion users see correctly positioned bubbles from the first frame.
    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // Seed with the real size immediately rather than waiting for the first
        // ResizeObserver callback, which would fire after children's useEffects.
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            setContainerSize({ width: rect.width, height: rect.height });
        }

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            if (width > 0 && height > 0) setContainerSize({ width, height });
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const { theme, mode } = layer;
    const backdrop = useMemo(() => buildBackdrop(theme), [theme]);

    const overlayBg =
        theme.overlay > 0
            ? `linear-gradient(180deg, hsl(${theme.hue} 26% 99% / ${(theme.overlay * 0.72).toFixed(2)}), hsl(${normalizeHue(theme.hue + Math.max(theme.hueSpread, 18))} 18% 98% / ${theme.overlay.toFixed(2)}))`
            : null;

    return (
        <div
            className={cn(
                "absolute inset-0 overflow-hidden",
                !reducedMotion && (mode === "enter" ? styles.layerEnter : styles.layerExit),
            )}
        >
            <div className="absolute inset-0" style={{ background: backdrop }} />
            <div
                ref={containerRef}
                className="absolute -inset-25"
                style={{ filter: "blur(50px)", transform: "translateZ(0)" }}
            >
                {bubbles.map((b) => (
                    <Bubble key={b.id} spec={b} containerSize={containerSize} reducedMotion={reducedMotion} mode={mode} />
                ))}
            </div>
            {overlayBg && <div className="absolute inset-0" style={{ background: overlayBg }} />}
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(circle at center, transparent 26%, rgba(255,255,255,0.14) 100%)",
                }}
            />
        </div>
    );
}

// ---------------------------------------------------------------------------
// SidebarBubbleBackground (main export)
// ---------------------------------------------------------------------------

export function SidebarBubbleBackground({
    theme,
    className,
}: {
    theme?: BubbleTheme;
    className?: string;
}) {
    const reducedMotion = useReducedMotion();

    const resolvedBase = resolveTheme(theme);
    const sig = themeSignature(resolvedBase);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const resolved = useMemo(() => resolvedBase, [sig]);

    const [layers, setLayers] = useState<LayerState[]>(() => [
        {
            id: Math.random().toString(36).substring(2),
            seed: (Math.random() * 0xffffffff) >>> 0,
            theme: resolved,
            mode: "enter",
        },
    ]);

    const prevSigRef = useRef(sig);

    useEffect(() => {
        if (sig === prevSigRef.current) return;
        prevSigRef.current = sig;

        const newId = Math.random().toString(36).substring(2);

        setLayers((prev) => [
            ...prev.map((l) => ({ ...l, mode: "exit" as const })),
            { id: newId, seed: (Math.random() * 0xffffffff) >>> 0, theme: resolved, mode: "enter" },
        ]);

        const timeout = window.setTimeout(
            () => setLayers((prev) => prev.filter((l) => l.mode === "enter")),
            reducedMotion ? 0 : EXIT_MS,
        );

        return () => window.clearTimeout(timeout);
    }, [sig, resolved, reducedMotion]);

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
            {layers.map((layer) => (
                <BubbleLayer key={layer.id} layer={layer} reducedMotion={reducedMotion} />
            ))}
        </div>
    );
}
