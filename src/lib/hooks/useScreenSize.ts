import { useEffect, useState } from "react";

export type ScreenSize = "sm" | "md" | "lg" | "xl" | "2xl" | "xs";

const breakpoints: Record<ScreenSize, number> = {
  xs: 0, // <640px
  sm: 640, // >=640px
  md: 768, // >=768px
  lg: 1024, // >=1024px
  xl: 1280, // >=1280px
  "2xl": 1536, // >=1536px
};

function getScreenSize(width: number): ScreenSize {
  if (width >= breakpoints["2xl"]) return "2xl";
  if (width >= breakpoints["xl"]) return "xl";
  if (width >= breakpoints["lg"]) return "lg";
  if (width >= breakpoints["md"]) return "md";
  if (width >= breakpoints["sm"]) return "sm";
  return "xs";
}

export function useScreenSize(): ScreenSize {
  const [screen, setScreen] = useState<ScreenSize>(() => {
    if (typeof window !== "undefined") {
      return getScreenSize(window.innerWidth);
    }
    return "md";
  });

  useEffect(() => {
    function handleResize() {
      setScreen(getScreenSize(window.innerWidth));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screen;
}
