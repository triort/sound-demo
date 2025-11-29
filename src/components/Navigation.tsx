"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface NavigationProps {
  prevHref?: string;
  prevLabel?: ReactNode;
  nextHref?: string;
  nextLabel?: ReactNode;
}

export default function Navigation({
  prevHref,
  prevLabel = "もどる",
  nextHref,
  nextLabel = "つぎへ",
}: NavigationProps) {
  return (
    <div className="flex justify-between mt-8">
      {prevHref ? (
        <Link
          href={prevHref}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg text-lg"
        >
          ← {prevLabel}
        </Link>
      ) : (
        <div />
      )}
      {nextHref ? (
        <Link
          href={nextHref}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg"
        >
          {nextLabel} →
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
