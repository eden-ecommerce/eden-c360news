"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LocateFixed, Loader2, AlertCircle } from "lucide-react";
import { NAMESPACE_PATH } from "@lib/config";
import { LONDON_COORDINATES, LONDON_LABEL } from "@lib/location/constants";

/**
 * "Use my location" button.
 *
 * On click:
 * 1. Requests browser geolocation permission.
 * 2. On success → navigates to /events/search?lat=…&lng=…&place=your+location
 * 3. On denial/error → falls back to the Cloudflare IP-derived location
 *    (pre-seeded server-side) or London as a last resort.
 */
export function UseMyLocationButton({
  cfLat,
  cfLng,
  cfLabel,
}: {
  cfLat?: number | null;
  cfLng?: number | null;
  cfLabel?: string | null;
}) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "locating" | "error">("idle");

  function navigateWithGeo(lat: number, lng: number, label: string) {
    const params = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
      place: label,
    });
    router.push(`${NAMESPACE_PATH}/search?${params.toString()}`);
  }

  function handleClick() {
    if (!navigator?.geolocation) {
      // No geolocation API — use CF header or London
      const lat = cfLat ?? LONDON_COORDINATES.latitude;
      const lng = cfLng ?? LONDON_COORDINATES.longitude;
      const label = cfLabel ?? LONDON_LABEL;
      navigateWithGeo(lat, lng, label);
      return;
    }

    setState("locating");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        navigateWithGeo(
          pos.coords.latitude,
          pos.coords.longitude,
          "your location",
        );
        // No need to reset state — navigation is imminent.
      },
      (err) => {
        // Permission denied (err.code === 1) or timeout/unavailable.
        // If we have a CF-derived location use it silently; otherwise show
        // a brief error message before falling back to London.
        if (cfLat && cfLng && cfLabel) {
          navigateWithGeo(cfLat, cfLng, cfLabel);
        } else {
          setState("error");
          setTimeout(() => {
            setState("idle");
            navigateWithGeo(
              LONDON_COORDINATES.latitude,
              LONDON_COORDINATES.longitude,
              LONDON_LABEL,
            );
          }, 2000);
        }
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state !== "idle"}
      aria-live="polite"
      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
    >
      {state === "locating" && (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      )}
      {state === "error" && (
        <AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
      )}
      {state === "idle" && (
        <LocateFixed className="h-4 w-4" aria-hidden="true" />
      )}
      {state === "locating" && "Locating…"}
      {state === "error" && "Location unavailable"}
      {state === "idle" && "Use my location"}
    </button>
  );
}
