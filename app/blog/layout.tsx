import { Suspense } from "react";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  // Suspense boundary needed for useSearchParams() in BlogListingPage / CategoryFilter.
  return <Suspense>{children}</Suspense>;
}
