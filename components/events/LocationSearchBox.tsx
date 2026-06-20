"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { NAMESPACE_PATH } from "@lib/config";
import { MapPin, Search } from "lucide-react";

export type TownOption = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  countyName: string;
  countySlug: string;
  regionName: string;
  regionSlug: string;
};

type Props = {
  towns: TownOption[];
  variant?: "hero" | "compact";
};

/** Typeahead over UK towns; navigates to a geo-anchored search on select. */
export function LocationSearchBox({ towns, variant = "hero" }: Props) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (q.length < 2) return [];
    return towns
      .filter((t) => t.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [value, towns]);

  function goToTown(town: TownOption) {
    const params = new URLSearchParams({
      lat: String(town.lat),
      lng: String(town.lng),
      place: town.name,
    });
    router.push(`${NAMESPACE_PATH}/search?${params.toString()}`);
  }

  function goToFreeText() {
    const q = value.trim();
    if (!q) return;
    const exact = towns.find((t) => t.name.toLowerCase() === q.toLowerCase());
    if (exact) {
      goToTown(exact);
      return;
    }
    router.push(`${NAMESPACE_PATH}/search?q=${encodeURIComponent(q)}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && matches[activeIndex]) {
        goToTown(matches[activeIndex]);
      } else {
        goToFreeText();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const isHero = variant === "hero";

  return (
    <div className="relative w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <MapPin
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary ${
              isHero ? "h-5 w-5" : "h-4 w-4"
            }`}
          />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
              setActiveIndex(0);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={onKeyDown}
            placeholder="Enter a town or city, e.g. Manchester"
            aria-label="Search events by location"
            autoComplete="off"
            className={`w-full rounded-full border border-border bg-card pl-12 pr-4 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30 ${
              isHero ? "h-14 text-base" : "h-11 text-sm"
            }`}
          />
        </div>
        <button
          type="button"
          onClick={goToFreeText}
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 ${
            isHero ? "h-14 text-base" : "h-11 text-sm"
          }`}
        >
          <Search className={isHero ? "h-5 w-5" : "h-4 w-4"} />
          Search
        </button>
      </div>

      {open && matches.length > 0 ? (
        <ul
          className="absolute z-20 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-border bg-popover p-1.5 shadow-lg"
          role="listbox"
        >
          {matches.map((town, i) => (
            <li key={`${town.regionSlug}-${town.countySlug}-${town.slug}`}>
              <button
                type="button"
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  goToTown(town);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${
                  i === activeIndex ? "bg-accent" : ""
                }`}
              >
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {town.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {town.countyName}, {town.regionName}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
