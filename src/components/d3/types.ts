import React from "react";

// Base interface for all chart data
export interface ChartDataPoint {
  id: number | string;
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

// Common chart props
export interface BaseChartProps {
  width: number;
  height: number;
  data: ChartDataPoint[];
  className?: string;
}

// Animation configuration
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
}

// Margin configuration for charts
export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Color scheme configuration
export interface ColorScheme {
  primary: string;
  secondary?: string;
  gradient?: [string, string];
}

// Tooltip configuration
export interface TooltipConfig {
  show: boolean;
  formatter?: (data: ChartDataPoint) => React.ReactNode;
  className?: string;
}

// Chart theme configuration
export interface ChartTheme {
  colors: ColorScheme;
  fonts: {
    family: string;
    size: {
      small: number;
      medium: number;
      large: number;
    };
  };
  animation: AnimationConfig;
}

// Default chart theme
export const defaultChartTheme: ChartTheme = {
  colors: {
    primary: "#3b82f6",
    secondary: "#1d4ed8",
    gradient: ["#3b82f6", "#1d4ed8"],
  },
  fonts: {
    family: "system-ui, -apple-system, sans-serif",
    size: {
      small: 10,
      medium: 12,
      large: 14,
    },
  },
  animation: {
    duration: 1000,
    delay: 100,
    easing: "ease-out",
  },
};
