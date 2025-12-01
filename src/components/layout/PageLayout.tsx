"use client";

import React from "react";
import LocaleSwitcher from "@components/shared/LocaleSwitcher";

interface PageLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  showLocaleSwitch?: boolean;
  contentClassName?: string;
  headerRightContent?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  pageTitle,
  pageDescription,
  showLocaleSwitch = true,
  contentClassName = "",
  headerRightContent,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-amber-50 to-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        {(pageTitle || showLocaleSwitch || headerRightContent) && (
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="mb-4 md:mb-0">
              {pageTitle && (
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {pageTitle}
                </h1>
              )}
              {pageDescription && (
                <p className="mt-1 text-gray-600">{pageDescription}</p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {headerRightContent}
              {showLocaleSwitch && <LocaleSwitcher />}
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className={contentClassName}>{children}</div>
      </div>
    </div>
  );
};

export default PageLayout;
