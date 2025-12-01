"use client";

import React from "react";

export interface FormSectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  error?: string;
  success?: string;
}

const FormSection: React.FC<FormSectionProps> = ({
  children,
  title,
  description,
  className = "",
  onSubmit,
  error,
  success,
}) => {
  const WrapperComponent = onSubmit ? "form" : "div";

  return (
    <WrapperComponent
      className={`bg-white rounded-xl shadow-md border border-gray-100 ${className}`}
      onSubmit={onSubmit}
    >
      {(title || description) && (
        <div className="border-b border-gray-100 px-6 py-4">
          {title && (
            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}

      <div className="p-6">
        {children}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-100 text-green-700 rounded-md text-sm">
            {success}
          </div>
        )}
      </div>
    </WrapperComponent>
  );
};

export default FormSection;
