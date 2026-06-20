"use client";

import { useFavourites } from "@lib/favourites/use-favourites";
import { Heart } from "lucide-react";
import Link from "next/link";

type Props = {
  href: string;
};

/**
 * Renders a "See Favourites (n)" link only when the user has saved events.
 * Client-only — reads localStorage after hydration.
 */
export function FavouritesLink({ href }: Props) {
  const { ids, hydrated } = useFavourites();

  if (!hydrated || ids.length === 0) return null;

  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 text-sm font-medium text-rose-500 transition-colors hover:text-rose-600"
    >
      <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
      <span>
        Favourites{" "}
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-semibold text-white">
          {ids.length}
        </span>
      </span>
    </Link>
  );
}
