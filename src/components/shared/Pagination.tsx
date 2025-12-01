import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@components/ui/shadcn/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrevious,
}: PaginationProps) {
  const t = useTranslations();

  return (
    <div className="flex justify-end items-center mt-6 space-x-2 mx-4">
      <Button
        className="px-3 py-1 border rounded disabled:opacity-50"
        disabled={!hasPrevious}
        onClick={() => onPageChange(currentPage - 1)}
      >
        {t("feedback.pagination.prev")}
      </Button>

      <span className="px-3 py-1 text-sm">
        {t("feedback.pagination.pageInfo", {
          current: currentPage,
          total: totalPages,
        })}
      </span>

      <Button
        className="px-3 py-1 border rounded disabled:opacity-50"
        disabled={!hasNext}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {t("feedback.pagination.next")}
      </Button>
    </div>
  );
}

export function PaginationWrapper({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrevious,
}: PaginationProps) {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      hasNext={hasNext}
      hasPrevious={hasPrevious}
    />
  );
}
