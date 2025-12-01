"use client";

import { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
  endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      error,
      label,
      helperText,
      fullWidth = false,
      endIcon,
      required = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    // Base styles
    const baseStyles =
      "block px-4 py-3 bg-white border rounded transition-colors focus:ring-2 focus:outline-none";

    // Error/Normal styles
    const stateStyles = error
      ? "border-red-300 focus:border-red-500 focus:ring-red-100 text-red-900 placeholder-red-300"
      : "border-gray-200 focus:border-amber-400 focus:ring-amber-100 text-gray-900 placeholder-gray-400";

    // Width styles
    const widthStyles = fullWidth ? "w-full" : "";

    const classes = `${baseStyles} ${stateStyles} ${widthStyles} ${className}`;

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-amber-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={classes}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {endIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-xs text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
