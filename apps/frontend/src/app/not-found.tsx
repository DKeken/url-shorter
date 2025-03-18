"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function NotFoundContent() {
  const searchParams = useSearchParams();
  const shortCode = searchParams.get("code");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>

        {shortCode ? (
          <p className="text-gray-600 mb-8">
            The URL with code <span className="font-semibold">{shortCode}</span>{" "}
            could not be found. It may have been deleted or expired.
          </p>
        ) : (
          <p className="text-gray-600 mb-8">
            The page you are looking for does not exist.
          </p>
        )}

        <Link href="/" passHref>
          <Button>Back to Homepage</Button>
        </Link>
      </div>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
