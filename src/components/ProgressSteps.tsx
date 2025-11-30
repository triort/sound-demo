"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const steps = [
  { path: "/", label: "スタート" },
  { path: "/record", label: "録音" },
  { path: "/process", label: "加工" },
  { path: "/explanation", label: "解説" },
  { path: "/summary", label: "まとめ" },
];

export default function ProgressSteps() {
  const pathname = usePathname();
  const currentIndex = steps.findIndex((step) => step.path === pathname);

  // トップページでは表示しない
  if (pathname === "/") {
    return null;
  }

  return (
    <div className="bg-white shadow-sm py-3 px-4 mb-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isClickable = index <= currentIndex;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.path} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
                {/* ステップアイコン */}
                {isClickable ? (
                  <Link href={step.path} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        isCurrent
                          ? "bg-blue-500 text-white"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    <span
                      className={`text-xs mt-1 whitespace-nowrap ${
                        isCurrent
                          ? "text-blue-600 font-bold"
                          : isCompleted
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </Link>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-gray-200 text-gray-400">
                      {index + 1}
                    </div>
                    <span className="text-xs mt-1 text-gray-400 whitespace-nowrap">
                      {step.label}
                    </span>
                  </div>
                )}

                {/* コネクタライン */}
                {!isLast && (
                  <div
                    className={`flex-1 h-1 mx-3 rounded-full self-start mt-4 ${
                      index < currentIndex ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
