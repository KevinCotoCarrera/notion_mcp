"use client";

import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "flat" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  rounded?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  padding = "md",
  shadow = "md",
  rounded = true,
  header,
  footer,
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-8",
  };

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-lg",
  };

  const variantClasses = {
    default: "bg-white",
    flat: "bg-gray-50",
    outlined: "bg-white border border-gray-200",
  };

  const roundedClass = rounded ? "rounded-xl" : "";

  const classes = `
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${roundedClass}
    ${className}
  `;

  return (
    <div className={classes}>
      {header && (
        <div
          className={`${
            padding !== "none" ? "-mx-5 -mt-5 mb-5 px-5 py-4" : ""
          } border-b border-gray-100`}
        >
          {header}
        </div>
      )}
      {children}
      {footer && (
        <div
          className={`${
            padding !== "none" ? "-mx-5 -mb-5 mt-5 px-5 py-4" : ""
          } border-t border-gray-100`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
