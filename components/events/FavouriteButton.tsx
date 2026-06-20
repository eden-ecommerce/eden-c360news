"use client";

import { useFavourites } from "@lib/favourites/use-favourites";
import { Heart } from "lucide-react";

type Props = {
  eventId: string;
  /** "icon" = small icon only (card), "full" = icon + label (detail page) */
  variant?: "icon" | "full";
  className?: string;
};

export function FavouriteButton({ eventId, variant = "icon", className = "" }: Props) {
  const { hydrated, toggle, isFav } = useFavourites();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(eventId);
  };

  // Always render the control so the heart is present in SSR markup and never
  // disappears in slower/preview environments. Only the "favoured" visual
  // state depends on localStorage, which is unknown until hydration — default
  // to not-favoured before then to avoid an SSR/client mismatch.
  const favoured = hydrated && isFav(eventId);

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={favoured ? "Remove from favourites" : "Save to favourites"}
        aria-pressed={favoured}
        className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          favoured
            ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
            : "border border-border bg-card text-foreground hover:border-rose-300 hover:text-rose-500"
        } ${className}`}
      >
        <Heart
          className="h-4 w-4"
          fill={favoured ? "currentColor" : "none"}
          aria-hidden="true"
        />
        {favoured ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={favoured ? "Remove from favourites" : "Save to favourites"}
      aria-pressed={favoured}
      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
        favoured
          ? "bg-rose-500 text-white"
          : "bg-white/80 text-foreground backdrop-blur-sm hover:bg-white hover:text-rose-500"
      } ${className}`}
    >
      <Heart
        className="h-4 w-4"
        fill={favoured ? "currentColor" : "none"}
        aria-hidden="true"
      />
    </button>
  );
}
