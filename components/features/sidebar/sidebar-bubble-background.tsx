"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import styles from "./sidebar-bubble-background.module.css";

export type SidebarBubbleValue = {
    /**
     * Center value used as the base for this bubble color property.
     */
    value: number;

    /**
     * Maximum random deviation on either side of `value`.
     *
     * The final generated value is chosen from
     * `value - spread` to `value + spread`.
     */
    spread?: number;
};

export type SidebarBubbleTheme = {
    /**
     * Stable identifier for this visual theme.
     *
     * Change this when the sidebar enters a distinctly different state
     * such as overview, study detail, or participant detail.
     * It is also used as part of the deterministic random seed so each
     * theme keeps a stable bubble layout between renders.
     */
    key: string;

    /**
     * Bubble hue in degrees.
     *
     * Example center values: 28 for orange, 140 for green, 220 for blue.
     * Use `spread` to control how much hue variation exists across bubbles.
     */
    hue: SidebarBubbleValue;

    /**
     * Bubble saturation in percent.
     *
     * Lower values feel softer and more muted. Higher values feel richer and
     * more colorful. Use `spread` to allow variation between bubbles.
     */
    saturation?: SidebarBubbleValue;

    /**
     * Bubble lightness in percent.
     *
     * Lower values make the background feel denser and bolder. Higher values
     * create a lighter, airier look. Use `spread` to allow variation between
     * bubbles.
     */
    lightness?: SidebarBubbleValue;

    /**
     * Bubble alpha / opacity.
     *
     * `value` controls the baseline bubble strength and `spread` controls how
     * much individual bubbles vary around that strength.
     * Expected range is `0` to `1`.
     */
    alpha?: SidebarBubbleValue;

    /**
     * Explicit start color for the static backdrop gradient behind the bubbles.
     *
     * This does not control the bubble colors themselves. It only controls the
     * base surface underneath the animated bubbles.
     *
     * Provide this when you want tighter art direction than the generated
     * defaults.
     */
    backgroundFrom?: string;

    /**
     * Explicit end color for the static backdrop gradient behind the bubbles.
     *
     * This does not control the bubble colors themselves. It only controls the
     * base surface underneath the animated bubbles.
     */
    backgroundTo?: string;

    /**
     * Strength of the soft surface wash above the bubbles.
     *
     * `0` means no overlay and therefore the boldest bubbles.
     * Higher values increasingly unify and soften the background.
     * Expected range is `0` to `1`.
     */
    overlayOpacity?: number;
};

type ResolvedBubbleValue = {
    value: number;
    spread: number;
};

type ResolvedSidebarBubbleTheme = {
    key: string;
    hue: ResolvedBubbleValue;
    saturation: ResolvedBubbleValue;
    lightness: ResolvedBubbleValue;
    alpha: ResolvedBubbleValue;
    backgroundFrom: string;
    backgroundTo: string;
    overlayOpacity: number;
};

type BubbleSpec = {
    id: string;
    width: number;
    height: number;
    left: number;
    top: number;
    opacity: number;
    blur: number;
    highlightColor: string;
    color: string;
    enterX: string;
    enterY: string;
    exitX: string;
    exitY: string;
    exitScale: number;
    driftX: string;
    driftY: string;
    driftScale: number;
    duration: string;
    delay: string;
};

const EXIT_DURATION_MS = 900;
const BUBBLE_COUNT = 24;

const DRIFT_DURATION_SECONDS = {
    min: 30,
    max: 45,
} as const;

const DRIFT_DISTANCE_PIXELS = {
    min: 150,
    max: 600,
} as const;

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function normalizeHue(value: number) {
    const normalized = value % 360;

    return normalized < 0 ? normalized + 360 : normalized;
}

function hashString(value: string) {
    let hash = 2166136261;

    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
}

function createRng(seed: number) {
    let state = seed || 1;

    return () => {
        state = (state + 0x6d2b79f5) | 0;
        let next = Math.imul(state ^ (state >>> 15), 1 | state);

        next ^= next + Math.imul(next ^ (next >>> 7), 61 | next);

        return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
    };
}

function pickBetween(rng: () => number, min: number, max: number) {
    return min + (max - min) * rng();
}

function resolveBubbleValue(
    value: SidebarBubbleValue | undefined,
    defaults: ResolvedBubbleValue,
    min: number,
    max: number
): ResolvedBubbleValue {
    return {
        value: clamp(value?.value ?? defaults.value, min, max),
        spread: clamp(value?.spread ?? defaults.spread, 0, max - min),
    };
}

function resolveHueValue(
    value: SidebarBubbleValue | undefined,
    defaults: ResolvedBubbleValue
): ResolvedBubbleValue {
    return {
        value: normalizeHue(value?.value ?? defaults.value),
        spread: clamp(value?.spread ?? defaults.spread, 0, 180),
    };
}

function buildThemeBackdrop(theme: ResolvedSidebarBubbleTheme) {
    const isDark = theme.lightness.value < 50;
    const accentHue = normalizeHue(theme.hue.value + Math.max(theme.hue.spread, 18));

    const l1 = isDark ? clamp(theme.lightness.value - 4, 4, 30) : 97;
    const l2 = isDark ? clamp(theme.lightness.value - 8, 2, 26) : 92;

    return [
        `radial-gradient(circle at 18% 14%, hsla(${theme.hue.value}, ${clamp(theme.saturation.value - theme.saturation.spread * 0.4, 0, 100)}%, ${l1}%, 0.9) 0%, transparent 42%)`,
        `radial-gradient(circle at 82% 78%, hsla(${accentHue}, ${clamp(theme.saturation.value - theme.saturation.spread * 0.8, 0, 100)}%, ${l2}%, 0.72) 0%, transparent 46%)`,
        `linear-gradient(180deg, ${theme.backgroundFrom} 0%, ${theme.backgroundTo} 100%)`,
    ].join(", ");
}

function resolveTheme(theme?: SidebarBubbleTheme): ResolvedSidebarBubbleTheme {
    const hue = resolveHueValue(theme?.hue, { value: 28, spread: 12 });
    const saturation = resolveBubbleValue(theme?.saturation, { value: 74, spread: 10 }, 0, 100);
    const lightness = resolveBubbleValue(theme?.lightness, { value: 73, spread: 8 }, 0, 100);
    const alpha = resolveBubbleValue(theme?.alpha, { value: 0.32, spread: 0.08 }, 0, 1);

    return {
        key: theme?.key ?? "sidebar-default",
        hue,
        saturation,
        lightness,
        alpha,
        backgroundFrom:
            theme?.backgroundFrom ??
            `hsla(${hue.value}, ${clamp(saturation.value - 24, 10, 80)}%, ${lightness.value < 50 ? clamp(lightness.value + 10, 10, 30) : 98}%, 0.96)`,
        backgroundTo:
            theme?.backgroundTo ??
            `hsla(${normalizeHue(hue.value + Math.max(hue.spread, 18))}, ${clamp(saturation.value - 32, 8, 72)}%, ${lightness.value < 50 ? clamp(lightness.value + 4, 5, 25) : 94}%, 0.92)`,
        overlayOpacity: clamp(theme?.overlayOpacity ?? 0.32, 0, 1),
    };
}

function buildBubbleSpecs(theme: ResolvedSidebarBubbleTheme, layerKey: string) {
    const rng = createRng(hashString(`${theme.key}:${layerKey}`));

    return Array.from({ length: BUBBLE_COUNT }, (_, index): BubbleSpec => {
        const hue = normalizeHue(
            theme.hue.value + pickBetween(rng, -theme.hue.spread, theme.hue.spread)
        );
        const saturation = clamp(
            theme.saturation.value + pickBetween(rng, -theme.saturation.spread, theme.saturation.spread),
            0,
            100
        );
        const lightness = clamp(
            theme.lightness.value + pickBetween(rng, -theme.lightness.spread, theme.lightness.spread),
            0,
            100
        );
        const alpha = clamp(
            theme.alpha.value + pickBetween(rng, -theme.alpha.spread, theme.alpha.spread),
            0,
            1
        );
        const width = pickBetween(rng, 180, 360);
        const height = width * pickBetween(rng, 0.82, 1.22);
        const left = pickBetween(rng, -32, 58);
        const top = pickBetween(rng, -15, 110);

        // Use polar coordinates to guarantee every bubble has a minimum drift distance
        const driftAngle = pickBetween(rng, 0, Math.PI * 2);
        const driftDistance = pickBetween(rng, DRIFT_DISTANCE_PIXELS.min, DRIFT_DISTANCE_PIXELS.max);
        const driftX = `${(Math.cos(driftAngle) * driftDistance).toFixed(1)}px`;
        const driftY = `${(Math.sin(driftAngle) * driftDistance).toFixed(1)}px`;
        const exitX = `${pickBetween(rng, -170, 170).toFixed(1)}px`;
        const exitY = `${pickBetween(rng, -200, 200).toFixed(1)}px`;
        const enterX = `${pickBetween(rng, -42, 42).toFixed(1)}px`;
        const enterY = `${pickBetween(rng, -56, 56).toFixed(1)}px`;

        return {
            id: `${layerKey}-${index}`,
            width,
            height,
            left,
            top,
            opacity: alpha,
            blur: pickBetween(rng, 42, 74),
            highlightColor: `hsla(${hue.toFixed(1)}, ${clamp(saturation + 8, 0, 100).toFixed(1)}%, ${clamp(lightness + 18, 0, 100).toFixed(1)}%, 0.92)`,
            color: `hsla(${hue.toFixed(1)}, ${saturation.toFixed(1)}%, ${lightness.toFixed(1)}%, 1)`,
            enterX,
            enterY,
            exitX,
            exitY,
            exitScale: pickBetween(rng, 0.56, 1.34),
            driftX,
            driftY,
            driftScale: pickBetween(rng, 0.9, 1.14),
            duration: `${pickBetween(rng, DRIFT_DURATION_SECONDS.min, DRIFT_DURATION_SECONDS.max).toFixed(1)}s`,
            delay: `${pickBetween(rng, -DRIFT_DURATION_SECONDS.max, 0).toFixed(1)}s`,
        };
    });
}

function useReducedMotion() {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReducedMotion(mediaQuery.matches);

        update();
        mediaQuery.addEventListener("change", update);

        return () => mediaQuery.removeEventListener("change", update);
    }, []);

    return reducedMotion;
}

function BubbleLayer({
    bubbles,
    theme,
    mode,
    reducedMotion,
}: {
    bubbles: BubbleSpec[];
    theme: ResolvedSidebarBubbleTheme;
    mode: "enter" | "exit";
    reducedMotion: boolean;
}) {
    const isDark = theme.lightness.value < 50;
    const overlayL1 = isDark ? 8 : 99;
    const overlayL2 = isDark ? 4 : 98;
    const overlayTopOpacity = clamp(theme.overlayOpacity * 0.72, 0, 1);
    const overlayBottomOpacity = clamp(theme.overlayOpacity, 0, 1);

    return (
        <div className="absolute inset-0 overflow-hidden">
            <div
                className="absolute inset-0"
                style={{ background: buildThemeBackdrop(theme) }}
            />
            <div className="absolute -inset-25" style={{ filter: "blur(50px)", transform: "translateZ(0)" }}>
                {bubbles.map((bubble) => (
                    <div
                        key={bubble.id}
                        className={cn(
                            "absolute will-change-[transform,opacity]",
                            !reducedMotion && (mode === "enter" ? styles.animateEnter : styles.animateExit)
                        )}
                        style={{
                            left: `${bubble.left}%`,
                            top: `${bubble.top}%`,
                            width: `${bubble.width}px`,
                            height: `${bubble.height}px`,
                            opacity: bubble.opacity,
                            ["--bubble-opacity" as string]: String(bubble.opacity),
                            ["--bubble-enter-x" as string]: bubble.enterX,
                            ["--bubble-enter-y" as string]: bubble.enterY,
                            ["--bubble-exit-x" as string]: bubble.exitX,
                            ["--bubble-exit-y" as string]: bubble.exitY,
                            ["--bubble-exit-scale" as string]: String(bubble.exitScale),
                        }}
                    >
                        <div
                            className={cn(
                                "size-full rounded-full will-change-transform",
                                !reducedMotion && styles.animateDrift
                            )}
                            style={{
                                background: `radial-gradient(circle at 30% 30%, ${bubble.highlightColor} 0%, ${bubble.color} 56%, transparent 88%)`,
                                animationDuration: bubble.duration,
                                animationDelay: bubble.delay,
                                ["--bubble-drift-x" as string]: bubble.driftX,
                                ["--bubble-drift-y" as string]: bubble.driftY,
                                ["--bubble-drift-scale" as string]: String(bubble.driftScale),
                            }}
                        />
                    </div>
                ))}
            </div>
            {theme.overlayOpacity > 0 ? (
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(180deg, hsla(${theme.hue.value}, 26%, ${overlayL1}%, ${overlayTopOpacity}) 0%, hsla(${normalizeHue(theme.hue.value + Math.max(theme.hue.spread, 18))}, 18%, ${overlayL2}%, ${overlayBottomOpacity}) 100%)`,
                    }}
                />
            ) : null}
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(circle at center, transparent 26%, rgba(${isDark ? '0,0,0' : '255,255,255'}, 0.14) 100%)`
                }}
            />
        </div>
    );
}

export function SidebarBubbleBackground({
    theme,
    className,
}: {
    theme?: SidebarBubbleTheme;
    className?: string;
}) {
    const reducedMotion = useReducedMotion();
    const resolvedTheme = resolveTheme(theme);
    const themeSignature = [
        resolvedTheme.key,
        resolvedTheme.hue.value,
        resolvedTheme.hue.spread,
        resolvedTheme.saturation.value,
        resolvedTheme.saturation.spread,
        resolvedTheme.lightness.value,
        resolvedTheme.lightness.spread,
        resolvedTheme.alpha.value,
        resolvedTheme.alpha.spread,
        resolvedTheme.backgroundFrom,
        resolvedTheme.backgroundTo,
        resolvedTheme.overlayOpacity,
    ].join(":");
    const [exitingTheme, setExitingTheme] = useState<ResolvedSidebarBubbleTheme | null>(null);
    const previousThemeRef = useRef(resolvedTheme);
    const previousThemeSignatureRef = useRef(themeSignature);

    useEffect(() => {
        if (themeSignature === previousThemeSignatureRef.current) {
            previousThemeRef.current = resolvedTheme;
            return;
        }

        setExitingTheme(previousThemeRef.current);
        previousThemeRef.current = resolvedTheme;
        previousThemeSignatureRef.current = themeSignature;

        const timeoutId = window.setTimeout(() => {
            setExitingTheme(null);
        }, reducedMotion ? 0 : EXIT_DURATION_MS);

        return () => window.clearTimeout(timeoutId);
    }, [reducedMotion, resolvedTheme, themeSignature]);

    const activeBubbles = buildBubbleSpecs(resolvedTheme, "active");
    const exitingBubbles = exitingTheme ? buildBubbleSpecs(exitingTheme, "exit") : [];

    return (
        <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
            {exitingTheme ? (
                <BubbleLayer
                    bubbles={exitingBubbles}
                    theme={exitingTheme}
                    mode="exit"
                    reducedMotion={reducedMotion}
                />
            ) : null}
            <BubbleLayer
                bubbles={activeBubbles}
                theme={resolvedTheme}
                mode="enter"
                reducedMotion={reducedMotion}
            />
        </div>
    );
}