import { useEffect, useRef } from "react";
import * as d3 from "d3";

/**
 * Custom hook for managing D3 SVG lifecycle
 * Handles creation, cleanup, and responsive resizing
 */
export function useD3SVG(
  dependencies: any[] = [],
  options: {
    responsive?: boolean;
    cleanup?: boolean;
  } = {}
) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { responsive = true, cleanup = true } = options;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Clear previous content if cleanup is enabled
    if (cleanup) {
      svg.selectAll("*").remove();
    }

    // Set up responsive behavior
    if (responsive) {
      const container = svgRef.current.parentElement;
      if (container) {
        const resizeObserver = new ResizeObserver(() => {
          // Trigger re-render on container resize
          // This could emit a custom event or call a callback
        });
        resizeObserver.observe(container);

        return () => resizeObserver.disconnect();
      }
    }
  }, dependencies);

  return svgRef;
}

/**
 * Utility function to create gradients for D3 charts
 */
export function createGradient(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  id: string,
  colors: [string, string],
  direction: "horizontal" | "vertical" = "horizontal"
) {
  const defs = svg.select("defs").empty()
    ? svg.append("defs")
    : svg.select("defs");

  const gradient = defs
    .append("linearGradient")
    .attr("id", id)
    .attr("x1", direction === "horizontal" ? "0%" : "0%")
    .attr("x2", direction === "horizontal" ? "100%" : "0%")
    .attr("y1", direction === "vertical" ? "0%" : "0%")
    .attr("y2", direction === "vertical" ? "100%" : "0%");

  gradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", colors[0])
    .attr("stop-opacity", 0.8);

  gradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", colors[1])
    .attr("stop-opacity", 1);

  return `url(#${id})`;
}

/**
 * Utility function for smooth D3 transitions
 */
export function createTransition(
  duration: number = 1000,
  delay: number = 0,
  easing: string = "ease-out"
) {
  return d3.transition().duration(duration).delay(delay).ease(d3.easeCircleOut); // You can map easing strings to d3 easing functions
}

/**
 * Format numbers for display in charts
 */
export function formatNumber(value: number, precision: number = 0): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(precision) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(precision) + "K";
  }
  return value.toFixed(precision);
}

/**
 * Get responsive dimensions based on container
 */
export function getResponsiveDimensions(
  container: HTMLElement,
  aspectRatio: number = 16 / 9,
  maxWidth: number = 800,
  maxHeight: number = 600
): { width: number; height: number } {
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  let width = Math.min(containerWidth, maxWidth);
  let height = Math.min(width / aspectRatio, maxHeight);

  // Ensure minimum dimensions
  width = Math.max(width, 200);
  height = Math.max(height, 150);

  return { width, height };
}

/**
 * Debounce function for resize events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
