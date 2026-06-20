import { Suspense } from "react";

export default function ChristianNewsLayout({ children }: { children: React.ReactNode }) {
  // Suspense boundary needed for useSearchParams() in BlogListingPage / CategoryFilter.
  return <Suspense>{children}</Suspense>;
}
