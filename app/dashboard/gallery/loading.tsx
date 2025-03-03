import React from "react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="relative aspect-square bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
