"use client";

import React from "react";

export interface SectionProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  padded?: boolean; // content padding
  divider?: boolean; // show header/content divider
}

const Section: React.FC<SectionProps> = ({
  title,
  description,
  actions,
  children,
  id,
  className = "",
  headerClassName = "",
  contentClassName = "",
  padded = true,
  divider = true,
}) => {
  return (
    <section
      id={id}
      className={`bg-white rounded-xl shadow-md border border-gray-100 ${className}`}
    >
      {(title || description || actions) && (
        <div
          className={`flex items-start justify-between gap-4 px-6 py-4 ${
            divider ? "border-b border-gray-100" : ""
          } ${headerClassName}`}
        >
          <div className="flex-1 min-w-0">
            {title && (
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}

      <div className={`${padded ? "p-6" : ""} ${contentClassName}`}>
        {children}
      </div>
    </section>
  );
};

export default Section;
