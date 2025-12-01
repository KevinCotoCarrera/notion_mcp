"use client";

/**
 * Auth Error Page
 * Displays authentication errors
 */

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ErrorState } from "@components/notion";
import { Button } from "@components/ui/shadcn/button";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Authentication failed";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <ErrorState
          title="Authentication Error"
          message={error}
        />
        <div className="flex justify-center gap-4 mt-6">
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
          <Link href="/notion/sprint-dashboard">
            <Button>Try Again</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
