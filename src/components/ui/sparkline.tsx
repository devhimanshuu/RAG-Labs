import { cn } from "@/lib/utils";

const TONES = {
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  muted: "text-fg-disabled",
} as const;

const VIEW_WIDTH = 100;
const VIEW_HEIGHT = 28;

interface Geometry {
  line: string;
  area: string;
  lastX: number;
  lastY: number;
}

function buildGeometry(values: number[]): Geometry | null {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = VIEW_WIDTH / (values.length - 1);

  const coordinates = values.map((value, index) => {
    const x = index * stepX;
    // 2px inset keeps the 1.5px stroke inside the viewBox at both extremes.
    const y = VIEW_HEIGHT - 2 - ((value - min) / span) * (VIEW_HEIGHT - 4);
    return [Number(x.toFixed(2)), Number(y.toFixed(2))] as const;
  });

  const line = coordinates.map(([x, y]) => `${x},${y}`).join(" ");
  const firstX = coordinates[0][0];
  const last = coordinates[coordinates.length - 1];

  return {
    line,
    // Closed polygon: baseline-left → series → baseline-right.
    area: `${firstX},${VIEW_HEIGHT} ${line} ${last[0]},${VIEW_HEIGHT}`,
    lastX: last[0],
    lastY: last[1],
  };
}

/**
 * Inline SVG sparkline.
 *
 * Hand-rolled rather than charted: these render several times per page and a
 * short polyline costs nothing, while a chart instance per metric would not.
 * Colour comes from `currentColor` so the caller selects a design token.
 */
export function Sparkline({
  values,
  tone = "accent",
  area = false,
  className,
  height = VIEW_HEIGHT,
  "aria-label": ariaLabel,
}: {
  values: number[];
  tone?: keyof typeof TONES;
  area?: boolean;
  className?: string;
  height?: number;
  "aria-label"?: string;
}) {
  const geometry = buildGeometry(values);

  if (!geometry) {
    return <div aria-hidden className={cn("h-7 w-full", className)} />;
  }

  return (
    <svg
      role="img"
      aria-label={ariaLabel ?? "Trend"}
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="none"
      height={height}
      className={cn("w-full", TONES[tone], className)}
    >
      {area ? <polygon points={geometry.area} fill="currentColor" opacity={0.12} /> : null}
      <polyline
        points={geometry.line}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={geometry.lastX} cy={geometry.lastY} r={1.75} fill="currentColor" />
    </svg>
  );
}
