"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  ChartDataPoint,
  BaseChartProps,
  ChartMargin,
  ColorScheme,
  AnimationConfig,
} from "./types";
import { useD3SVG, createGradient, createTransition } from "./hooks";

interface HorizontalBarChartProps extends Omit<BaseChartProps, "data"> {
  data: ChartDataPoint[];
  margin?: ChartMargin;
  colorScheme?: ColorScheme;
  animation?: AnimationConfig;
  maxItems?: number;
  showValues?: boolean;
  showLabels?: boolean;
  onBarClick?: (data: ChartDataPoint) => void;
  onBarHover?: (data: ChartDataPoint | null) => void;
}

const defaultMargin: ChartMargin = {
  top: 10,
  right: 40,
  bottom: 30,
  left: 100,
};

const defaultColorScheme: ColorScheme = {
  primary: "#3b82f6",
  secondary: "#1d4ed8",
  gradient: ["#3b82f6", "#1d4ed8"],
};

const defaultAnimation: AnimationConfig = {
  duration: 1000,
  delay: 100,
};

export function HorizontalBarChart({
  width,
  height,
  data,
  margin = defaultMargin,
  colorScheme = defaultColorScheme,
  animation = defaultAnimation,
  maxItems = 8,
  showValues = true,
  showLabels = true,
  className = "",
  onBarClick,
  onBarHover,
}: HorizontalBarChartProps) {
  const svgRef = useD3SVG([data, width, height, colorScheme]);
  const [hoveredItem, setHoveredItem] = useState<ChartDataPoint | null>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Sort and limit data
    const sortedData = [...data]
      .sort((a, b) => b.value - a.value)
      .slice(0, maxItems);

    if (sortedData.length === 0) return;

    const maxValue = d3.max(sortedData, (d) => d.value) || 1;

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([0, chartWidth]);

    const yScale = d3
      .scaleBand()
      .domain(sortedData.map((d) => d.name))
      .range([0, chartHeight])
      .padding(0.2);

    // Create gradient
    const gradientId = `gradient-${colorScheme.primary.replace("#", "")}`;
    if (colorScheme.gradient) {
      createGradient(svg, gradientId, colorScheme.gradient, "horizontal");
    }

    // Create chart group
    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create bars
    const barGroups = chartGroup
      .selectAll(".bar-group")
      .data(sortedData)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .style("cursor", onBarClick ? "pointer" : "default");

    // Bar rectangles
    const bars = barGroups
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (d) => yScale(d.name)!)
      .attr("width", 0) // Start with 0 width for animation
      .attr("height", yScale.bandwidth())
      .attr(
        "fill",
        (d) =>
          d.color ||
          (colorScheme.gradient ? `url(#${gradientId})` : colorScheme.primary)
      )
      .attr("rx", 4)
      .attr("ry", 4)
      .on("mouseenter", function (event, d) {
        setHoveredItem(d);
        onBarHover?.(d);

        d3.select(this)
          .transition()
          .duration(200)
          .attr("fill-opacity", 0.8)
          .attr("transform", "scale(1.02)");
      })
      .on("mouseleave", function () {
        setHoveredItem(null);
        onBarHover?.(null);

        d3.select(this)
          .transition()
          .duration(200)
          .attr("fill-opacity", 1)
          .attr("transform", "scale(1)");
      })
      .on("click", function (event, d) {
        onBarClick?.(d);
      });

    // Animate bars
    bars
      .transition()
      .duration(animation.duration)
      .delay((d, i) => i * (animation.delay || 0))
      .attr("width", (d) => xScale(d.value));

    // Add labels if enabled
    if (showLabels) {
      barGroups
        .append("text")
        .attr("class", "bar-label")
        .attr("x", -5)
        .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("fill", "currentColor")
        .attr("font-size", "12px")
        .attr("font-weight", "500")
        .text((d) =>
          d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name
        )
        .style("opacity", 0)
        .transition()
        .duration(animation.duration)
        .delay((d, i) => i * (animation.delay || 0))
        .style("opacity", 1);
    }

    // Add value labels if enabled
    if (showValues) {
      barGroups
        .append("text")
        .attr("class", "value-label")
        .attr("x", (d) => xScale(d.value) + 5)
        .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .attr("fill", "currentColor")
        .attr("font-size", "11px")
        .attr("font-weight", "600")
        .text((d) => d.value)
        .style("opacity", 0)
        .transition()
        .duration(animation.duration)
        .delay((d, i) => i * (animation.delay || 0) + 500)
        .style("opacity", 1);
    }
  }, [
    data,
    width,
    height,
    colorScheme,
    animation,
    maxItems,
    showValues,
    showLabels,
    onBarClick,
    onBarHover,
  ]);

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
      />
      {hoveredItem && (
        <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs pointer-events-none z-10">
          <div className="font-semibold">{hoveredItem.name}</div>
          <div>
            {hoveredItem.value} item{hoveredItem.value !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
