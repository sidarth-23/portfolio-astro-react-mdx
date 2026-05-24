import * as React from "react"

import { cn } from "@/lib/utils"

type CircularProgressProps = Omit<React.ComponentProps<"svg">, "children"> & {
  value: number
  min?: number
  max?: number
  size?: number
  strokeWidth?: number
  trackClassName?: string
  indicatorClassName?: string
  indicatorDataAttribute?: string
}

function clamp(input: number, min: number, max: number): number {
  if (input < min) return min
  if (input > max) return max
  return input
}

function CircularProgress({
  value,
  min = 0,
  max = 100,
  size = 18,
  strokeWidth = 1.5,
  className,
  trackClassName,
  indicatorClassName,
  indicatorDataAttribute,
  ...props
}: CircularProgressProps) {
  const normalizedValue = clamp(value, min, max)
  const radius = size / 2 - strokeWidth
  const circumference = 2 * Math.PI * radius
  const progress = ((normalizedValue - min) / (max - min || 1)) * circumference
  const dashOffset = circumference - progress

  return (
    <svg
      role="progressbar"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={normalizedValue}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("shrink-0", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className={cn("stroke-current/25", trackClassName)}
      />
      <circle
        {...(indicatorDataAttribute
          ? { [indicatorDataAttribute]: "" }
          : {})}
        data-circumference={circumference}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className={cn("transition-all", indicatorClassName)}
      />
    </svg>
  )
}

export { CircularProgress }
