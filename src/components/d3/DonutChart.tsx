"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  ChartDataPoint,
  BaseChartProps,
  ColorScheme,
  AnimationConfig,
} from "./types";
import { useD3SVG, createGradient } from "./hooks";

interface DonutChartProps extends Omit<BaseChartProps, "data"> {
  data: ChartDataPoint[];
  innerRadius?: number;
  outerRadius?: number;
  colorScheme?: ColorScheme;
  animation?: AnimationConfig;
  showLabels?: boolean;
  showPercentages?: boolean;
  onSliceClick?: (data: ChartDataPoint) => void;
  onSliceHover?: (data: ChartDataPoint | null) => void;
}

const defaultColorScheme: ColorScheme = {
  primary: "#3b82f6",
  secondary: "#1d4ed8",
};

const defaultAnimation: AnimationConfig = {
  duration: 1000,
  delay: 100,
};

export function DonutChart({
  width,
  height,
  data,
  innerRadius = 40,
  outerRadius = 80,
  colorScheme = defaultColorScheme,
  animation = defaultAnimation,
  showLabels = true,
  showPercentages = true,
  className = "",
  onSliceClick,
  onSliceHover,
}: DonutChartProps) {
  const svgRef = useD3SVG([data, width, height, colorScheme]);
  const [hoveredSlice, setHoveredSlice] = useState<ChartDataPoint | null>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);

    const radius = Math.min(width, height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;

    // Filter out zero values
    const filteredData = data.filter((d) => d.value > 0);

    if (filteredData.length === 0) return;

    // Calculate total for percentages
    const total = d3.sum(filteredData, (d) => d.value);

    // Create color scale
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(filteredData.map((d) => d.name))
      .range(d3.schemeSet3);

    // Create pie generator
    const pie = d3
      .pie<ChartDataPoint>()
      .padAngle(0.02)
      .sort(null)
      .value((d) => d.value);

    // Create arc generator
    const arc = d3
      .arc<d3.PieArcDatum<ChartDataPoint>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    // Create label arc (slightly outside)
    const labelArc = d3
      .arc<d3.PieArcDatum<ChartDataPoint>>()
      .innerRadius(outerRadius + 10)
      .outerRadius(outerRadius + 10);

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${centerX},${centerY})`);

    // Create pie slices
    const arcs = chartGroup
      .selectAll(".arc")
      .data(pie(filteredData))
      .enter()
      .append("g")
      .attr("class", "arc")
      .style("cursor", onSliceClick ? "pointer" : "default");

    // Add paths (slices)
    const paths = arcs
      .append("path")
      .attr("fill", (d, i) => d.data.color || colorScale(d.data.name))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("mouseenter", function (event, d) {
        setHoveredSlice(d.data);
        onSliceHover?.(d.data);

        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", "scale(1.05)");
      })
      .on("mouseleave", function () {
        setHoveredSlice(null);
        onSliceHover?.(null);

        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", "scale(1)");
      })
      .on("click", function (event, d) {
        onSliceClick?.(d.data);
      });

    // Animate the slices
    paths
      .transition()
      .duration(animation.duration)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t)) || "";
        };
      });

    // Add labels if enabled
    if (showLabels) {
      arcs
        .append("text")
        .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "500")
        .attr("fill", "currentColor")
        .style("opacity", 0)
        .text((d) => {
          const percentage = ((d.data.value / total) * 100).toFixed(1);
          return showPercentages
            ? `${d.data.name} (${percentage}%)`
            : d.data.name;
        })
        .transition()
        .duration(animation.duration)
        .delay(500)
        .style("opacity", 1);
    }

    // Add center text
    const centerText = chartGroup
      .append("g")
      .attr("class", "center-text")
      .attr("text-anchor", "middle");

    centerText
      .append("text")
      .attr("dy", "-0.2em")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .attr("fill", "currentColor")
      .text(total);

    centerText
      .append("text")
      .attr("dy", "1.2em")
      .attr("font-size", "12px")
      .attr("fill", "currentColor")
      .attr("opacity", 0.7)
      .text("Total");
  }, [
    data,
    width,
    height,
    innerRadius,
    outerRadius,
    colorScheme,
    animation,
    showLabels,
    showPercentages,
    onSliceClick,
    onSliceHover,
  ]);

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
      />
      {hoveredSlice && (
        <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs pointer-events-none z-10">
          <div className="font-semibold">{hoveredSlice.name}</div>
          <div>{hoveredSlice.value} items</div>
          <div>
            {(
              (hoveredSlice.value / d3.sum(data, (d) => d.value)) *
              100
            ).toFixed(1)}
            %
          </div>
        </div>
      )}
    </div>
  );
}
